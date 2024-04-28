

## ExpertEase

ExpertEase is a web app driving progress towards UN SDG 4: Quality Education by connecting students with professionals for mentorship, sharing resources, and fostering discussions on academic and career development, aiming to solve global educational challenges.

## Object Model using Domain Driven Design (DDM)

```mermaid

classDiagram
    class User {
        <<abstract>>
        - Int UserID
        - String username
        - String email
        - String firstName
        - String lastNAme
        - Boolean Gender       
        - String password
        - String DOB
        - String ProfilePhoto
        - String Role
        - register()
        - registerUsing()
        - login()
        - logout()
        - followTopic()
        - createTopic()
        - createDiscussion()
        - commentOnDiscussion()
    }
 
    class Seeker {
        - bookMentorshipSlot()
        - likeArticle()
        - commentOnArticle()
    }

    class MentorshipSlot {
        - int slotId
        - String meetingLink
        - Provider provider
        - Seeker seeker
    }
 
    class Provider {
        - createSlots()
        - deleteSlots()
        - createArticle()
        - likeArticle()
        - commentOnArticle()
    }


    class Category {
        - int categoryID
        - String categoryName
    }



    class Topic {
        - int topicID
        - int categoryID
        - String topicName
    }
 
    class Discussion {
        - int topicID
        - String title
        - String Content
        - Int upvote
        - Int DownVote
        - String[] comments
        - upvote()
        - downvote()
        - addComment()
        
    }
 

 
    class Article {
        - int categoryId
        - String title
        - String content
        - String[] attachments
        - like()
        - comment()
    }

    class Slot {
        - int slotId
        - int providerId
        - Time startTime
        - Time endTime
        - addSlot()
        - removeSlot()

    }


 
User <|-- Seeker
User <|-- Provider
Category "1" *-- "0..n"  Topic
Topic "1" *-- "0..n" Discussion
User "0..n" --> "1..n" Category
MentorshipSlot "1" -- "1" Provider
MentorshipSlot "1" -- "1" Seeker
Article "0..n" -- "1" Provider
Article "0..n" -- "1" Category
Provider "1"*-- "0..n" Slot

```

## Project Run Steps
- [Install Tailwind](https://tailwindcss.com/docs/guides/vite)
- Create .env file in server with 3 keys
  - PORT = (Server port)
  - JWT_SECRET = 12321421429104
  - MONGO_CONNECTION = mongodb+srv://<Username>:<Password>@firstcluster.ac5gcif.mongodb.net/Expertease?retryWrites=true&w=majority&appName=FirstCluster (Use the username and password for the Expertease dB access is shared)
- Run npm install in client directory
- npm run dev on client (Client server will be  up)
- Run npm install in server directory
- node server.js (Backend Server will be up)
