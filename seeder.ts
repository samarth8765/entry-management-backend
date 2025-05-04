import axios from 'axios';
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:8080/api/v1';

// List of gates
const GATES = ['Gate-1', 'Gate-2', 'Gate-3', 'Gate-4'];

// Function to create a person
async function createPerson(name: string) {
  try {
    const response = await axios.post(`${BASE_URL}/person`, {
      personName: name
    });
    return response.data.data.personId;
  } catch (error) {
    console.error('Error creating person:', error);
    return null;
  }
}

// Function to create an entry event
async function createEntry(personId: string, gate: string) {
  try {
    await axios.post(`${BASE_URL}/event/entry`, {
      personId,
      gate
    });
  } catch (error) {
    console.error('Error creating entry event:', error);
  }
}

// Function to create an exit event
async function createExit(personId: string, gate: string) {
  try {
    await axios.post(`${BASE_URL}/event/exit`, {
      personId,
      gate
    });
  } catch (error) {
    console.error('Error creating exit event:', error);
  }
}

// Main seeding function
async function seedData() {
  console.log('Starting data seeding...');

  // Create 15 persons
  for (let i = 0; i < 15; i++) {
    const name = faker.person.fullName();
    console.log(`Creating person ${i + 1}: ${name}`);
    const personId = await createPerson(name);

    if (personId) {
      // For first 7 people (half rounded down), make them end up inside
      // For last 8 people, make them end up outside
      const shouldEndInside = i < 7;
      const numEvents = faker.number.int({ min: 6, max: 10 });

      for (let j = 0; j < numEvents; j++) {
        // Generate entry event
        const entryGate = faker.helpers.arrayElement(GATES);
        await createEntry(personId, entryGate);
        console.log(`Created entry event for ${name} at ${entryGate}`);

        // Generate exit event, but skip the last exit if person should end up inside
        if (!shouldEndInside || j < numEvents - 1) {
          const exitGate = faker.helpers.arrayElement(GATES);
          await createExit(personId, exitGate);
          console.log(`Created exit event for ${name} at ${exitGate}`);
        }
      }
    }
  }

  console.log('Data seeding completed!');
}

// Run the seeder
seedData().catch(console.error);
