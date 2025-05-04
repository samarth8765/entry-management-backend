#  Entry Management System – Full API Documentation

##  Setup (Backend using Bun)

```bash
npm install -g bun
git clone https://github.com/samarth8765/entry-management-backend.git
cd entry-management-backend
bun install
```

### Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/entry-management-system

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*
```

After setting up the environment variables, start the server:

```bash
bun dev
```

---

## Base URL

```
https://entry-management-api.samarthdhawan.com/api/v1
```

In Postman, set:

```json
{{ENDPOINT}} = https://entry-management-api.samarthdhawan.com/api/v1
```

---

##  Person APIs

### Create Person

**POST** `{{ENDPOINT}}/person`

**Request:**
```json
{
  "personName": "Ron"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "personId": "PR-73M86C",
    "name": "Ron",
    "currentlyInside": false,
    "_id": "6817292393ba14da9e3642e1",
    "createdAt": "2025-05-04T08:45:23.616Z",
    "updatedAt": "2025-05-04T08:45:23.616Z"
  }
}
```

---

### Get All Persons Inside

**GET** `{{ENDPOINT}}/person`

**Response:**
```json
{
  "status": true,
  "meta": {
    "totalCount": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  },
  "data": [
    {
      "_id": "6816a7ef30ceeb1c99a49744",
      "personId": "PR-PV7HHB",
      "name": "Anurag",
      "currentlyInside": true,
      "createdAt": "2025-05-03T23:34:07.532Z",
      "updatedAt": "2025-05-03T23:39:34.646Z",
      "lastEntry": "2025-05-03T23:39:34.645Z",
      "lastExit": "2025-05-03T23:39:32.166Z"
    }
  ]
}
```

---

### Get Person By ID

**GET** `{{ENDPOINT}}/person/:personId`

Example:
```
/person/PR-L68LK8
```

**Response:**
```json
{
  "status": true,
  "data": {
    "_id": "6816a718a82f306a1c787f37",
    "personId": "PR-L68LK8",
    "name": "Mohan",
    "currentlyInside": true,
    "createdAt": "2025-05-03T23:30:32.358Z",
    "updatedAt": "2025-05-04T08:44:58.554Z",
    "lastEntry": "2025-05-04T08:44:58.554Z",
    "lastExit": "2025-05-04T08:44:57.099Z"
  }
}
```

---

### Get Person History

**GET** `{{ENDPOINT}}/person/:personId/history`

**Response:**
```json
{
  "status": true,
  "meta": {
    "totalCount": 13,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 13
  },
  "data": [
    {
      "eventType": "entry",
      "gate": "Gate-3",
      "timestamp": "2025-05-04T08:44:58.549Z"
    },
    {
      "eventType": "exit",
      "gate": "Gate-2",
      "timestamp": "2025-05-04T08:44:57.078Z"
    }
    // ...more entries
  ]
}
```

---

## Entry/Exit Event APIs

###  Register Entry

**POST** `{{ENDPOINT}}/event/entry`

**Request:**
```json
{
  "gate": "Gate-3",
  "personId": "PR-L68LK8"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "personId": "PR-L68LK8",
    "eventType": "entry",
    "gate": "Gate-3",
    "_id": "6817290a93ba14da9e3642d5",
    "timestamp": "2025-05-04T08:44:58.549Z"
  }
}
```

---

### Register Exit

**POST** `{{ENDPOINT}}/event/exit`

**Request:**
```json
{
  "gate": "Gate-2",
  "personId": "PR-L68LK8"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "personId": "PR-L68LK8",
    "eventType": "exit",
    "gate": "Gate-2",
    "_id": "6816ae011c8bbbde825b9b03",
    "timestamp": "2025-05-04T00:00:01.836Z"
  }
}
```

---

## Analytics

### Get Analytics

**GET** `{{ENDPOINT}}/analytics`

**Response:**
```json
{
  "status": true,
  "data": {
    "currentOccupancyInsideBuilding": 2,
    "averageStayDuration": 178.21,
    "peakEntryTime": {
      "count": 8,
      "hour": 23
    },
    "peakExitTime": {
      "count": 6,
      "hour": 23
    },
    "gateUsage": {
      "entryGates": {
        "Gate 1": 6,
        "Gate-3": 4
      },
      "exitGates": {
        "Gate 1": 5,
        "Gate-2": 2
      }
    }
  }
}
```

- Note: `hour` values are in **UTC**. Convert to local time on the frontend if needed.

