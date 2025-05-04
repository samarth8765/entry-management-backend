import type { Document } from 'mongoose';

export enum EventType {
  ENTRY = 'entry',
  EXIT = 'exit'
}

export interface IEvent {
  personId: string;
  eventType: EventType;
  gate: string;
  timestamp?: Date;
}

export interface IEventDocument extends IEvent, Document {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventQueryFilters {
  personId?: string;
  eventType?: EventType;
  startDate?: Date;
  endDate?: Date;
  gate?: string;
  timestamp?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export interface IEntryExitPayload {
  personId: string;
  gate: string;
}

export interface HistoryQueryParams {
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsSummary {
  currentOccupancy: number;
  averageStayDuration: number; // in minutes
  peakEntryTime: {
    hour: number;
    count: number;
  };
  peakExitTime: {
    hour: number;
    count: number;
  };
  gateUsage: {
    entryGates: Record<string, number>;
    exitGates: Record<string, number>;
  };
}
