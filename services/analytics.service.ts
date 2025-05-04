import type { PipelineStage } from 'mongoose';
import Event from '../model/event.model';
import Person from '../model/person.model';
import { EventType } from '../types/event';

const calculateAverageStayDuration = async () => {
  // we need to match entry and exit events for each person
  const pipeline = [
    // group events by person ID
    {
      $group: {
        _id: {
          personId: '$personId',
          eventType: '$eventType'
        },
        events: {
          $push: {
            timestamp: '$timestamp'
          }
        }
      }
    },
    // convert the grouped results into a more usable format
    {
      $group: {
        _id: '$_id.personId',
        entryEvents: {
          $push: {
            $cond: [
              { $eq: ['$_id.eventType', EventType.ENTRY] },
              '$events',
              '$$REMOVE'
            ]
          }
        },
        exitEvents: {
          $push: {
            $cond: [
              { $eq: ['$_id.eventType', EventType.EXIT] },
              '$events',
              '$$REMOVE'
            ]
          }
        }
      }
    },
    // flatten the arrays
    {
      $project: {
        _id: 1,
        entryEvents: { $arrayElemAt: ['$entryEvents', 0] },
        exitEvents: { $arrayElemAt: ['$exitEvents', 0] }
      }
    },
    // calculate durations for each pair of entry/exit
    {
      $unwind: {
        path: '$entryEvents',
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $unwind: {
        path: '$exitEvents',
        preserveNullAndEmptyArrays: false
      }
    },
    // only include entries followed by exits (no re-entries without exits)
    {
      $match: {
        $expr: {
          $gt: ['$exitEvents.timestamp', '$entryEvents.timestamp']
        }
      }
    },
    // calculate duration in minutes
    {
      $project: {
        duration: {
          $divide: [
            { $subtract: ['$exitEvents.timestamp', '$entryEvents.timestamp'] },
            60000 // convert milliseconds to minutes
          ]
        }
      }
    },
    // calculate average duration
    {
      $group: {
        _id: null,
        averageDuration: { $avg: '$duration' }
      }
    }
  ];

  const result = await Event.aggregate(pipeline);

  // return the average duration or 0 if no data
  return result.length > 0 ? result[0].averageDuration : 0;
};

const findPeakTime = async (eventType: EventType) => {
  const pipeline: PipelineStage[] = [
    { $match: { eventType } },
    { $project: { hour: { $hour: '$timestamp' } } },
    { $group: { _id: '$hour', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
    { $project: { _id: 0, hour: '$_id', count: 1 } }
  ];

  const result = await Event.aggregate(pipeline);
  return result.length > 0 ? result[0] : { hour: 0, count: 0 };
};

const getGateUsageStats = async () => {
  const entryGatesPipeline: PipelineStage[] = [
    { $match: { eventType: EventType.ENTRY } },
    { $group: { _id: '$gate', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ];

  const exitGatesPipeline: PipelineStage[] = [
    { $match: { eventType: EventType.EXIT } },
    { $group: { _id: '$gate', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ];

  const entryGatesResults = await Event.aggregate(entryGatesPipeline);
  const exitGatesResults = await Event.aggregate(exitGatesPipeline);

  // convert arrays to objects for easier consumption
  const entryGates = entryGatesResults.reduce(
    (acc, gate) => {
      acc[gate._id] = gate.count;
      return acc;
    },
    {} as Record<string, number>
  );

  const exitGates = exitGatesResults.reduce(
    (acc, gate) => {
      acc[gate._id] = gate.count;
      return acc;
    },
    {} as Record<string, number>
  );

  return { entryGates, exitGates };
};

const GetBuildingAnalytics = async () => {
  const currentOccupancyInsideBuilding = await Person.countDocuments({
    currentlyInside: true
  });

  const averageStayDuration = await calculateAverageStayDuration();
  const peakEntryTime = await findPeakTime(EventType.ENTRY);
  const peakExitTime = await findPeakTime(EventType.EXIT);
  const gateUsage = await getGateUsageStats();

  return {
    currentOccupancyInsideBuilding,
    averageStayDuration,
    peakEntryTime,
    peakExitTime,
    gateUsage
  };
};

export const AnalyticsService = {
  GetBuildingAnalytics
};
