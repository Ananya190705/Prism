# PRISM – Proactive Real-time Issue and Service Monitoring

PRISM is a full-stack hostel complaint management web application developed using the MERN stack. It provides a centralized platform for students to register and track hostel complaints while enabling wardens and administrators to efficiently review, assign, prioritize, and resolve issues.

The system aims to improve communication, transparency, and complaint resolution within hostel environments.

##  Features

- **Student Registration:** Students can register and submit hostel-related complaints.
- **Complaint Tracking:** Track complaint status and monitor resolution progress.
- **Complaint Management:** Wardens and administrators can review, prioritize, assign, and update complaints.
- **Role-Based Dashboards:** Separate dashboards for students, wardens, and administrators.
- **Automated Escalation:** Complaints with no activity for three days are automatically escalated.
- **Complaint Status Management:** Manage complaints throughout their lifecycle, from submission to resolution.
- **Centralized Storage:** Store and retrieve complaint information securely using MongoDB.

##  Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| API | RESTful APIs |

##  Project Architecture

```text
PRISM/
│
├── frontend/       # React.js application
│
├── backend/        # Node.js and Express.js REST APIs
│
└── README.md
```

##  Application Workflow

1. Students access the application and register.
2. Students submit complaints related to hostel issues.
3. Complaints are stored in the MongoDB database.
4. Wardens and administrators review submitted complaints.
5. Complaints are prioritized and assigned for resolution.
6. Students can track the status of their complaints.
7. Complaints inactive for three days are automatically escalated.
8. Administrators and wardens update complaints until resolution.

##  Project Objective

The primary objective of PRISM is to streamline hostel complaint management by replacing manual complaint-handling processes with a centralized digital platform. It improves complaint tracking, accountability, and coordination between students, wardens, and administrators.

##  Key Highlights

- Full-stack web application developed using the MERN stack.
- Role-based complaint management.
- RESTful API integration.
- Secure complaint storage, retrieval, and status management.
- Automated escalation for inactive complaints.

##  Developer

**Ananya G**

GitHub: [Ananya190705](https://github.com/Ananya190705)

---

*PRISM – Making Hostel Complaint Management Smarter and More Efficient.*
