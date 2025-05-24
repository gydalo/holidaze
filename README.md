# Holidaze - Semester Project 2

Holidaze is a fake Airbnb-style web application where users can test booking and hosting functionality by registering and logging in with a @stud.noroff.no email. The page is designed to simulate a vacation rental platform, allowing users to experience both booking and managing venues.

## Description
Holidaze allows users to sign up either as regular users or as venue managers. Regular users can explore available venues and make bookings, while venue managers can additionally create, edit, and manage their own venues, as well as view bookings made by others on their listings.

After creating a profile, users can customize it by uploading a banner, avatar, and writing a short bio. The profile page also gives users access to:

- Their own venue listings (if they are a venue manager)
- Bookings made on their venues
- Bookings they have made on other venues

### Design Phase:
The design started in Figma, focusing on a clean and minimal layout. I am not super happy with how the design turned out, but it was ok. I would probably do it differently if I could start over. I tried to make the page intuitive and simple to navigate. 

### Development Phase:
I tried using Typescript for the first time in this project. I was a little scared at the beginning for it to be too overwhelming, but I found typescript to be nice to use.

The application was built using:
- React
- TypeScript
- Tailwind CSS

### Features:
- Homepage with searchable venue listings and date filters
- Booking System: Users can select dates, check availability, and get a full price breakdown before confirming a booking
- Profile Page: Users can view and edit their profile details, see upcoming and past bookings, and for venue managers, monitor bookings
- Venue Creation: Venue managers can create and edit detailed venue listings, upload multiple images, and define amenities like Wi-Fi, pets, and parking
- Dynamic Calendar: Prevents double bookings and disables unavailable dates

## Target Audience
While Holidaze is a fake service, it’s designed for anyone who wants to simulate an Airbnb-like experience. Whether you’re testing out UI/UX workflows or just exploring the logic behind hosting and booking systems, Holidaze is a fun and functional demo platform.


## How to setup
You can browse venues without an account, but to fully test the platform you can register with any email ending in @stud.noroff.no. After registering:
- Regular users can book venues
- Venue managers can also create and manage their own listings
- Both users can change their bio, avatar and banner on their profile page.

