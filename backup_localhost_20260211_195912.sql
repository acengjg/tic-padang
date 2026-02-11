--
-- PostgreSQL database dump
--

\restrict rgtMBri6VtoF6limOxLrFf3pBjp6FPFgNdXohUcuofCaclXHOq5c6XNi3Rga7Pl

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."TravelBuddyPost" DROP CONSTRAINT IF EXISTS "TravelBuddyPost_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."TravelBuddyPost" DROP CONSTRAINT IF EXISTS "TravelBuddyPost_destinationId_fkey";
ALTER TABLE IF EXISTS ONLY public."TravelBuddyApplication" DROP CONSTRAINT IF EXISTS "TravelBuddyApplication_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."TravelBuddyApplication" DROP CONSTRAINT IF EXISTS "TravelBuddyApplication_postId_fkey";
ALTER TABLE IF EXISTS ONLY public."TourPackage" DROP CONSTRAINT IF EXISTS "TourPackage_guideId_fkey";
ALTER TABLE IF EXISTS ONLY public."Story" DROP CONSTRAINT IF EXISTS "Story_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."StoryMedia" DROP CONSTRAINT IF EXISTS "StoryMedia_storyId_fkey";
ALTER TABLE IF EXISTS ONLY public."StoryLike" DROP CONSTRAINT IF EXISTS "StoryLike_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."StoryLike" DROP CONSTRAINT IF EXISTS "StoryLike_storyId_fkey";
ALTER TABLE IF EXISTS ONLY public."StoryComment" DROP CONSTRAINT IF EXISTS "StoryComment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."StoryComment" DROP CONSTRAINT IF EXISTS "StoryComment_storyId_fkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_destinationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Plan" DROP CONSTRAINT IF EXISTS "Plan_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."PlanItem" DROP CONSTRAINT IF EXISTS "PlanItem_planId_fkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_bookingId_fkey";
ALTER TABLE IF EXISTS ONLY public."PackageReview" DROP CONSTRAINT IF EXISTS "PackageReview_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."PackageReview" DROP CONSTRAINT IF EXISTS "PackageReview_packageId_fkey";
ALTER TABLE IF EXISTS ONLY public."PackageReview" DROP CONSTRAINT IF EXISTS "PackageReview_guideId_fkey";
ALTER TABLE IF EXISTS ONLY public."PackageReview" DROP CONSTRAINT IF EXISTS "PackageReview_bookingId_fkey";
ALTER TABLE IF EXISTS ONLY public."Message" DROP CONSTRAINT IF EXISTS "Message_senderId_fkey";
ALTER TABLE IF EXISTS ONLY public."Message" DROP CONSTRAINT IF EXISTS "Message_conversationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Guide" DROP CONSTRAINT IF EXISTS "Guide_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."GuideReview" DROP CONSTRAINT IF EXISTS "GuideReview_reviewerId_fkey";
ALTER TABLE IF EXISTS ONLY public."GuideReview" DROP CONSTRAINT IF EXISTS "GuideReview_guideId_fkey";
ALTER TABLE IF EXISTS ONLY public."GuideEarning" DROP CONSTRAINT IF EXISTS "GuideEarning_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."GuideEarning" DROP CONSTRAINT IF EXISTS "GuideEarning_guideId_fkey";
ALTER TABLE IF EXISTS ONLY public."Conversation" DROP CONSTRAINT IF EXISTS "Conversation_guideId_fkey";
ALTER TABLE IF EXISTS ONLY public."ConversationMember" DROP CONSTRAINT IF EXISTS "ConversationMember_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ConversationMember" DROP CONSTRAINT IF EXISTS "ConversationMember_conversationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_articleId_fkey";
ALTER TABLE IF EXISTS ONLY public."Booking" DROP CONSTRAINT IF EXISTS "Booking_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Booking" DROP CONSTRAINT IF EXISTS "Booking_packageId_fkey";
ALTER TABLE IF EXISTS ONLY public."Booking" DROP CONSTRAINT IF EXISTS "Booking_guideId_fkey";
ALTER TABLE IF EXISTS ONLY public."BookingMessage" DROP CONSTRAINT IF EXISTS "BookingMessage_senderId_fkey";
ALTER TABLE IF EXISTS ONLY public."BookingMessage" DROP CONSTRAINT IF EXISTS "BookingMessage_bookingId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."TravelBuddyApplication_postId_userId_key";
DROP INDEX IF EXISTS public."StoryLike_storyId_userId_key";
DROP INDEX IF EXISTS public."Payment_bookingId_key";
DROP INDEX IF EXISTS public."PackageReview_bookingId_key";
DROP INDEX IF EXISTS public."Guide_userId_key";
DROP INDEX IF EXISTS public."ConversationMember_conversationId_userId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."TravelBuddyPost" DROP CONSTRAINT IF EXISTS "TravelBuddyPost_pkey";
ALTER TABLE IF EXISTS ONLY public."TravelBuddyApplication" DROP CONSTRAINT IF EXISTS "TravelBuddyApplication_pkey";
ALTER TABLE IF EXISTS ONLY public."TourPackage" DROP CONSTRAINT IF EXISTS "TourPackage_pkey";
ALTER TABLE IF EXISTS ONLY public."Story" DROP CONSTRAINT IF EXISTS "Story_pkey";
ALTER TABLE IF EXISTS ONLY public."StoryMedia" DROP CONSTRAINT IF EXISTS "StoryMedia_pkey";
ALTER TABLE IF EXISTS ONLY public."StoryLike" DROP CONSTRAINT IF EXISTS "StoryLike_pkey";
ALTER TABLE IF EXISTS ONLY public."StoryComment" DROP CONSTRAINT IF EXISTS "StoryComment_pkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_pkey";
ALTER TABLE IF EXISTS ONLY public."Promotion" DROP CONSTRAINT IF EXISTS "Promotion_pkey";
ALTER TABLE IF EXISTS ONLY public."Plan" DROP CONSTRAINT IF EXISTS "Plan_pkey";
ALTER TABLE IF EXISTS ONLY public."PlanItem" DROP CONSTRAINT IF EXISTS "PlanItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_pkey";
ALTER TABLE IF EXISTS ONLY public."PackageReview" DROP CONSTRAINT IF EXISTS "PackageReview_pkey";
ALTER TABLE IF EXISTS ONLY public."Message" DROP CONSTRAINT IF EXISTS "Message_pkey";
ALTER TABLE IF EXISTS ONLY public."Guide" DROP CONSTRAINT IF EXISTS "Guide_pkey";
ALTER TABLE IF EXISTS ONLY public."GuideReview" DROP CONSTRAINT IF EXISTS "GuideReview_pkey";
ALTER TABLE IF EXISTS ONLY public."GuideEarning" DROP CONSTRAINT IF EXISTS "GuideEarning_pkey";
ALTER TABLE IF EXISTS ONLY public."Event" DROP CONSTRAINT IF EXISTS "Event_pkey";
ALTER TABLE IF EXISTS ONLY public."Destination" DROP CONSTRAINT IF EXISTS "Destination_pkey";
ALTER TABLE IF EXISTS ONLY public."Conversation" DROP CONSTRAINT IF EXISTS "Conversation_pkey";
ALTER TABLE IF EXISTS ONLY public."ConversationMember" DROP CONSTRAINT IF EXISTS "ConversationMember_pkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_pkey";
ALTER TABLE IF EXISTS ONLY public."Booking" DROP CONSTRAINT IF EXISTS "Booking_pkey";
ALTER TABLE IF EXISTS ONLY public."BookingMessage" DROP CONSTRAINT IF EXISTS "BookingMessage_pkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TravelBuddyPost";
DROP TABLE IF EXISTS public."TravelBuddyApplication";
DROP TABLE IF EXISTS public."TourPackage";
DROP TABLE IF EXISTS public."StoryMedia";
DROP TABLE IF EXISTS public."StoryLike";
DROP TABLE IF EXISTS public."StoryComment";
DROP TABLE IF EXISTS public."Story";
DROP TABLE IF EXISTS public."Review";
DROP TABLE IF EXISTS public."Promotion";
DROP TABLE IF EXISTS public."PlanItem";
DROP TABLE IF EXISTS public."Plan";
DROP TABLE IF EXISTS public."Payment";
DROP TABLE IF EXISTS public."PackageReview";
DROP TABLE IF EXISTS public."Message";
DROP TABLE IF EXISTS public."GuideReview";
DROP TABLE IF EXISTS public."GuideEarning";
DROP TABLE IF EXISTS public."Guide";
DROP TABLE IF EXISTS public."Event";
DROP TABLE IF EXISTS public."Destination";
DROP TABLE IF EXISTS public."ConversationMember";
DROP TABLE IF EXISTS public."Conversation";
DROP TABLE IF EXISTS public."Comment";
DROP TABLE IF EXISTS public."BookingMessage";
DROP TABLE IF EXISTS public."Booking";
DROP TABLE IF EXISTS public."Article";
DROP TYPE IF EXISTS public."Role";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'GUIDE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    image text NOT NULL,
    category text NOT NULL,
    author text DEFAULT 'Admin'::text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "subjectDate" text,
    "subjectTitle" text
);


--
-- Name: Booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "packageId" text NOT NULL,
    "guideId" text NOT NULL,
    "userId" text NOT NULL,
    "bookingDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tourDate" timestamp(3) without time zone NOT NULL,
    participants integer NOT NULL,
    "totalPrice" integer NOT NULL,
    "paymentStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "paymentMethod" text,
    "bookingStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "specialRequests" text,
    "travelerDetails" jsonb,
    "cancelledBy" text,
    "cancelReason" text,
    "refundAmount" integer,
    "isReviewed" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BookingMessage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BookingMessage" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    "senderId" text NOT NULL,
    "senderType" text NOT NULL,
    message text NOT NULL,
    "isAutoMessage" boolean DEFAULT false NOT NULL,
    attachments text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "articleId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Conversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Conversation" (
    id text NOT NULL,
    "guideId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "subjectDate" text,
    "subjectTitle" text
);


--
-- Name: ConversationMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ConversationMember" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Destination" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    rating double precision NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    image360 text,
    description text NOT NULL,
    price text,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    name text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    description text NOT NULL,
    price text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Guide; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Guide" (
    id text NOT NULL,
    "userId" text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "verificationLevel" text DEFAULT 'BASIC'::text NOT NULL,
    bio text NOT NULL,
    languages text[],
    specializations text[],
    "yearsExperience" integer NOT NULL,
    "videoIntroUrl" text,
    certifications text[],
    "averageRating" double precision DEFAULT 0 NOT NULL,
    "totalTours" integer DEFAULT 0 NOT NULL,
    "totalReviews" integer DEFAULT 0 NOT NULL,
    "responseRate" double precision DEFAULT 0 NOT NULL,
    "responseTime" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: GuideEarning; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GuideEarning" (
    id text NOT NULL,
    "guideId" text NOT NULL,
    "userId" text,
    amount integer NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "withdrawnAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: GuideReview; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GuideReview" (
    id text NOT NULL,
    "guideId" text NOT NULL,
    "reviewerId" text NOT NULL,
    rating double precision NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    attachments text[],
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PackageReview; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PackageReview" (
    id text NOT NULL,
    "packageId" text NOT NULL,
    "bookingId" text NOT NULL,
    "userId" text NOT NULL,
    "guideId" text NOT NULL,
    "overallRating" integer NOT NULL,
    "communicationRating" integer,
    "punctualityRating" integer,
    "knowledgeRating" integer,
    "valueRating" integer,
    comment text,
    photos text[],
    "isVerified" boolean DEFAULT true NOT NULL,
    "helpfulCount" integer DEFAULT 0 NOT NULL,
    "guideReply" text,
    "guideReplyAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    amount integer NOT NULL,
    "platformFee" integer NOT NULL,
    "guidePayout" integer NOT NULL,
    method text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "paymentGateway" text,
    "transactionId" text,
    "paidAt" timestamp(3) without time zone,
    "releasedToGuide" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Plan" (
    id text NOT NULL,
    "userId" text NOT NULL,
    date text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PlanItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlanItem" (
    id text NOT NULL,
    "planId" text NOT NULL,
    "time" text NOT NULL,
    place text NOT NULL,
    activity text NOT NULL
);


--
-- Name: Promotion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Promotion" (
    id text NOT NULL,
    title text NOT NULL,
    discount text NOT NULL,
    image text NOT NULL,
    provider text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "videoUrl" text
);


--
-- Name: Review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "destinationId" text NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Story; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Story" (
    id text NOT NULL,
    "userId" text NOT NULL,
    caption text,
    location text,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone
);


--
-- Name: StoryComment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StoryComment" (
    id text NOT NULL,
    "storyId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: StoryLike; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StoryLike" (
    id text NOT NULL,
    "storyId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: StoryMedia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StoryMedia" (
    id text NOT NULL,
    "storyId" text NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: TourPackage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TourPackage" (
    id text NOT NULL,
    "guideId" text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    tags text[],
    description text NOT NULL,
    duration integer NOT NULL,
    "durationType" text NOT NULL,
    "maxParticipants" integer NOT NULL,
    "basePrice" integer NOT NULL,
    "groupDiscount" jsonb,
    "meetingPoint" text NOT NULL,
    "meetingPointLat" double precision,
    "meetingPointLng" double precision,
    itinerary jsonb NOT NULL,
    inclusions text[],
    exclusions text[],
    requirements jsonb NOT NULL,
    photos text[],
    "availableDays" text[],
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "averageRating" double precision DEFAULT 0 NOT NULL,
    "totalBookings" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TravelBuddyApplication; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TravelBuddyApplication" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    message text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TravelBuddyPost; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TravelBuddyPost" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "destinationId" text,
    title text NOT NULL,
    description text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "maxBuddies" integer DEFAULT 2 NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    requirements text,
    "budgetRange" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    avatar text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "subjectDate" text,
    "subjectTitle" text
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Article" (id, title, content, image, category, author, date, "createdAt", "updatedAt", "subjectDate", "subjectTitle") FROM stdin;
cmlaw6yol0002fqd4dfhbmvea	Wisata Kuliner: Menjelajahi Kelezatan Sate Padang di Malam Hari	Sate Padang adalah primadona kuliner malam hari. Temukan rekomendasi sate padang paling legendaris di pusat kota Padang.	https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800	Kuliner	Admin	2026-02-06 12:59:33.525	2026-02-06 12:59:33.525	2026-02-06 12:59:33.525	\N	\N
cmlaw6yoj0001fqd4102pomgv	5 Spot Sunset Terbaik di Padang yang Wajib Dikunjungi	Padang terkenal dengan sunsetnya yang memukau. Berikut adalah 5 spot terbaik mulai dari Pantai Air Manis hingga Gunung Padang.	data:image/jpeg;base64,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	Tips	Admin	2026-02-06 12:59:33.523	2026-02-06 12:59:33.523	2026-02-06 13:47:55.884	\N	\N
cmlaw6yod0000fqd4uejaaqnb	Festival Siti Nurbaya 2026: Kemeriahan Budaya di Tepi Pantai	Festival Siti Nurbaya kembali hadir di tahun 2026 dengan rangkaian acara yang lebih megah. Mulai dari lomba selaju sampan hingga pawai budaya Minangkabau. Selamat menikmati acara	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWX9mrIpy8AhlqixCFosYi6yQMHz6ZAjG7oQ&s	Budaya	Admin	2026-02-06 12:59:33.517	2026-02-06 12:59:33.517	2026-02-07 00:31:51.143	\N	\N
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Booking" (id, "packageId", "guideId", "userId", "bookingDate", "tourDate", participants, "totalPrice", "paymentStatus", "paymentMethod", "bookingStatus", "specialRequests", "travelerDetails", "cancelledBy", "cancelReason", "refundAmount", "isReviewed", "createdAt", "updatedAt") FROM stdin;
cmlddqoe20007aykoucsgmh4l	cmldb2ohs0002aykog1191wrk	cmld9u94c0001ybj875t942lo	cml3v6oqb00015yx82wzgqmwn	2026-02-08 06:46:19.129	2026-02-10 00:00:00	3	300000	PENDING	\N	CONFIRMED		\N	\N	\N	\N	f	2026-02-08 06:46:19.129	2026-02-08 10:56:20.076
cmlde0uz70009aykopdml658g	cmldb2ohs0002aykog1191wrk	cmld9u94c0001ybj875t942lo	cml3v6oqb00015yx82wzgqmwn	2026-02-08 06:54:14.228	2026-02-20 00:00:00	5	500000	PENDING	\N	CANCELLED		\N	USER	Sudah ada paket lain	\N	f	2026-02-08 06:54:14.228	2026-02-08 10:57:42.543
\.


--
-- Data for Name: BookingMessage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BookingMessage" (id, "bookingId", "senderId", "senderType", message, "isAutoMessage", attachments, "createdAt") FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (id, content, "articleId", "userId", "createdAt") FROM stdin;
cmlb19yqv0001on6aplkyumch	ok	cmlaw6yod0000fqd4uejaaqnb	cml3u71g10003mns1xxlit0f6	2026-02-06 15:21:51.655
cmldv9jj30009eole467qc2n4	Mantap	cmlaw6yod0000fqd4uejaaqnb	cml3v6oqb00015yx82wzgqmwn	2026-02-08 14:56:52.764
\.


--
-- Data for Name: Conversation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Conversation" (id, "guideId", "createdAt", "updatedAt", "subjectDate", "subjectTitle") FROM stdin;
cmldqgith0001eoled2jens1r	cmld9u94c0001ybj875t942lo	2026-02-08 12:42:20.352	2026-02-08 12:47:47.158	\N	\N
\.


--
-- Data for Name: ConversationMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ConversationMember" (id, "conversationId", "userId", "createdAt") FROM stdin;
cmldqgiti0003eolehwo53osm	cmldqgith0001eoled2jens1r	cml3v6oqb00015yx82wzgqmwn	2026-02-08 12:42:20.352
\.


--
-- Data for Name: Destination; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Destination" (id, name, category, rating, location, image, image360, description, price, lat, lng, "createdAt", "updatedAt") FROM stdin;
cml57nzji000012yjhbwl33u2	Pantai Muaro Lasak	Alam	4.5	Padang	https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/0b/0c/4a/taman-muara-lasak.jpg?w=700&h=400&s=1	https://destinasi.pariwisata.padang.go.id/api-destinasi/img360/1686266828_65d46b8a1c170eeba564.jpg	Test 360 description	Gratis	-0.9300204980824796	100.3503227233887	2026-02-02 13:34:06.503	2026-02-03 11:28:30.168
cml3u712a0001mns195hip88g	Pantai Padang (Taplau)	Alam	4.5	Pantai Padang	data:image/jpeg;base64,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	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686266828_65d46b8a1c170eeba564.jpg	Tempat berkumpul warga untuk menikmati matahari terbenam sembari menyantap pisang bakar dan kelapa muda.	Gratis	-0.9499734475010407	100.3512668609619	2026-02-01 14:29:14.147	2026-02-03 11:30:55.749
cml3u712a0000mns1yegosfgv	Sate Padang Manang Kabau	Kuliner	4.8	Jl. Khatib Sulaiman	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7sZroi48aAS6jBNURvaAc_hE3E6F-SI0F8Q&s	https://pannellum.org/images/alma.jpg	Sate legendaris dengan bumbu rempah kuning yang kental dan daging sapi yang empuk. Wajib dicoba saat berkunjung ke Sumatera Barat.	Rp 35.000	-0.922632	100.361107	2026-02-01 14:29:14.147	2026-02-03 11:31:08.267
cml8tzp2y000acqhv1u0oozfq	Masjid Agung Nurul Iman	Religi	4.5	Belakang Pondok, Padang Selatan, Padang City, West Sumatra 25133	https://lh3.googleusercontent.com/gps-cs-s/AHVAwerer0Op0u5sd0E8Mlspo4coirbdqfTbmEo6CfAAcbS8gVD898PZkgrWc2TOdjNGOhNcl8zvmadZ0vzY20JQVxrs9xizWmRRCvOZc5guTnwpkuVRBCNRCdXZrl6fP28KL5BvwVSFLA=w408-h306-k-no	https://lh3.googleusercontent.com/gps-cs-s/AHVAwerer0Op0u5sd0E8Mlspo4coirbdqfTbmEo6CfAAcbS8gVD898PZkgrWc2TOdjNGOhNcl8zvmadZ0vzY20JQVxrs9xizWmRRCvOZc5guTnwpkuVRBCNRCdXZrl6fP28KL5BvwVSFLA=w408-h306-k-no	Masjid Nurul Iman	Gratis	-6.95470622637854	100.3621565919541	2026-02-05 02:22:22.89	2026-02-05 02:22:38.142
cml8ugzip000ecqhvtkz1ya55	Jalan Pantai Aie Manish	Alam	4.5	Jalan Pantai Aie Manih 	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686179866_849741e30d5100710451.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686179866_849741e30d5100710451.jpg	Perjalanan menuju Pantai Aie Manih dari pusat Kota Padang biasanya memakan waktu sekitar 20–30 menit dengan kendaraan, mengikuti jalan beraspal yang menurun dari area perbukitan menuju pesisir pantai. Rute ini kini relatif lebih nyaman dan mulus, serta dilengkapi dengan papan petunjuk, sehingga pengunjung bisa menikmati pemandangan laut dan bukit sepanjang perjalanan sebelum tiba di bibir pantai yang landai dan luas.	Gratis	-0.9749466538151561	100.3590559959412	2026-02-05 02:35:49.586	2026-02-05 02:35:49.586
cml8ud2n5000dcqhv8k748c1f	Air Terjun Tigo Pangkek	Alam	4.5	Guo Kuranji	https://scontent-sin11-1.xx.fbcdn.net/v/t39.30808-6/489406536_10162343927019299_8197169979125840855_n.jpg?stp=c0.143.1296.1296a_dst-jpg_s552x414_tt6&_nc_cat=104&ccb=1-7&_nc_sid=714c7a&_nc_ohc=PnN1cBX58TkQ7kNvwGWos0q&_nc_oc=AdmESnon2vEwDNgwp8ZS0eOXGgt9cO9JEIDgyMwzZGFaNF_ndIg688lCWI5rk3b7KIQ&_nc_zt=23&_nc_ht=scontent-sin11-1.xx&_nc_gid=BsWmqh8auO8-i6zce3V5AQ&oh=00_Afv1y1uDS6fnZSQNwpBkv2UR9vmtNCdvXqDMv2bLioYhGQ&oe=698B0A53	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686265489_117c53413666c9143b3d.jpg	Air Terjun Tigo Pangkek di Padang merupakan destinasi alam yang menawarkan suasana sejuk, air jernih, dan pemandangan hijau yang masih asri. Air terjun ini memiliki beberapa tingkatan dengan kolam alami yang cocok untuk bersantai. Aksesnya melalui jalur trekking ringan, sehingga memberi pengalaman wisata alam yang menyenangkan dan menenangkan.	Gratis	-0.86694270170983	100.4411315917969	2026-02-05 02:32:46.992	2026-02-06 02:09:00.574
cml8u2q9b000bcqhvdlt3hffv	Masjid Al-Hakim	Religi	4.8	Jl. Samudera, Berok Nipah, Kec. Padang Bar., Kota Padang, Sumatera Barat	https://scontent-sin11-1.xx.fbcdn.net/v/t39.30808-6/489024603_10162339831784299_5305434301317199940_n.jpg?stp=c210.0.1342.1342a_dst-jpg_s552x414_tt6&_nc_cat=105&ccb=1-7&_nc_sid=714c7a&_nc_ohc=0q_9tZhqt9cQ7kNvwEFbgJA&_nc_oc=AdlOmB85XoNoaYzRQr77gi-vyeH_odeBEz0W0FGOi1qb1oGLxFbSUgD18uWtFH0ohs8&_nc_zt=23&_nc_ht=scontent-sin11-1.xx&_nc_gid=CDDZWPVXiWEhBrZYLFhUnA&oh=00_AfvSb4HMPEy0nRf3xQlR-FLhHTyJJITU4zYrKVMWEcKeEQ&oe=698B3793	https://lh3.googleusercontent.com/gps-cs-s/AHVAweorQezlo-1AHi8odzMGrW7WRAph5lf5HWod1XZhmIQNEFlIxKXBVuqWMqu0Mp0uhwNEtUbBnrJHqCXDyxpmfd9mSZfPjpnF6ZwR1tOWc31EfRib4wqgeUU-9wNkZ7Unilwki0Jogg=w408-h408-k-no	Masjid Al-Hakim terletak di tepi pantai padang	Gratis	-3.96033681642564	100.3532199784628	2026-02-05 02:24:44.399	2026-02-06 02:13:42.45
cml8tv7x50009cqhv34fhpdcq	Basko City Mall - Bypass	Belanja	4.7	Jl. Manunggal 3, Kalumbuk, Kec. Kuranji, Kota Padang, Sumatera Barat 25171	https://lh3.googleusercontent.com/gps-cs-s/AHVAwep-TRzWv5CZn5h6rLF8d474lDLBv8hrjX1H1-MrkDZPzRk02VAQQuA4AmFF8O4kOHe3x5DHR-Spd2DJofZ0WsF62sD4eF4AsFUQMdEMSOExje57VFtoZWq2NHmYXwGvtsmzUxWqE0OlgZhK=w408-h408-k-no	https://lh3.googleusercontent.com/gps-cs-s/AHVAwep-TRzWv5CZn5h6rLF8d474lDLBv8hrjX1H1-MrkDZPzRk02VAQQuA4AmFF8O4kOHe3x5DHR-Spd2DJofZ0WsF62sD4eF4AsFUQMdEMSOExje57VFtoZWq2NHmYXwGvtsmzUxWqE0OlgZhK=w408-h408-k-no	Basko City Mall di bypass 	Gratis	-0.9161563509391315	100.3982162475586	2026-02-05 02:18:54.041	2026-02-06 04:26:34.564
cml8t3j3g0008cqhv6zfgfiib	Mie Gacoan By Pass	Kuliner	5	Jl. By Pass Jl. Durian Tarung, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175	https://lh3.googleusercontent.com/p/AF1QipPDlJ7w0amH0HGdEQxU6ITezQgcN1t2OvzYJ1A9=w408-h407-k-no	https://lh3.googleusercontent.com/p/AF1QipPDlJ7w0amH0HGdEQxU6ITezQgcN1t2OvzYJ1A9=w408-h407-k-no	Mie Gacoan Mie pedas nomor 1 	Mulai dari 8000	-0.9241761954625831	100.398645401001	2026-02-05 01:57:22.139	2026-02-06 04:55:55.455
cml8uwpzq000lcqhveznori0f	Kawasan Agrowisata Sungai Lareh	Alam	4.5	Sungai Lareh Lubuk Minturun	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686389838_64b54122b8a1593b3133.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686389838_64b54122b8a1593b3133.jpg	Kawasan Agrowisata Sungai Lareh adalah area agrowisata yang berada di Lubuk Minturun, Kecamatan Koto Tangah, Kota Padang dengan lahan luas yang dipenuhi tanaman produktif seperti tanaman pangan, holtikultura, perkebunan, serta kolam ikan dan sawah yang terawat. Destinasi ini dirancang sebagai wisata edukatif dan alam yang cocok untuk keluarga atau pelajar yang ingin mengenal pertanian, peternakan, dan perikanan sambil menikmati suasana pedesaan yang hijau dan tenang di perbukitan Sungai Lareh. Pengunjung dapat belajar langsung tentang budidaya tanaman dan aktivitas agraris, serta merasakan pengalaman wisata yang berbeda dari objek wisata biasa.	Gratis	-0.8563008997656355	100.4007858037949	2026-02-05 02:48:03.734	2026-02-05 02:48:03.734
cml8uxpud000mcqhvliv2d9uv	Air Terjun Lubuk Tempurung	Alam	4.5	Guo Kuranji	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1688431125_358d32f677d358dbe531.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1688431125_358d32f677d358dbe531.jpg	Air Terjun Lubuk Tempurung merupakan destinasi wisata alam yang menawarkan keindahan air terjun alami dengan suasana hutan yang asri dan sejuk. Aliran airnya yang jernih berpadu dengan bebatuan alami menciptakan panorama menenangkan, cocok untuk wisata alam, bersantai, dan menikmati keindahan alam sekitar.	Gratis	-0.8641427950101647	100.429801940918	2026-02-05 02:48:50.196	2026-02-05 02:48:50.196
cml8v80xj000pcqhve77r26qi	Kampung Nelayan Sungai Pisang	Alam	4.5	Kelurahan Teluk Kabung Selatan	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1690380363_37c643af55ac266c848d.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1690380363_37c643af55ac266c848d.jpg	Kampung Nelayan Sungai Pisang merupakan destinasi wisata pesisir yang menawarkan suasana kampung nelayan tradisional dengan pemandangan laut yang indah. Terletak di kawasan Pantai Barat Sumatera, tempat ini dikenal dengan perahu-perahu nelayan, hasil laut segar, serta pantai yang masih alami dan tenang. Sungai Pisang cocok dikunjungi bagi wisatawan yang ingin menikmati keindahan alam, budaya lokal, dan kehidupan masyarakat pesisir yang sederhana namun khas.	Gratis	-1.113706361855006	100.3755774461356	2026-02-05 02:56:51.127	2026-02-05 02:56:51.127
cml8upyas000icqhve1elpjmo	Kota Tua Padang	Budaya	4.5	kawasan Muaro Padang	https://scontent-sin11-2.xx.fbcdn.net/v/t39.30808-6/513070219_10162657479119299_1880868151093839958_n.jpg?stp=c316.0.1417.1417a_dst-jpg_s552x414_tt6&_nc_cat=108&ccb=1-7&_nc_sid=714c7a&_nc_ohc=X71c2ikL9JgQ7kNvwGWEn-j&_nc_oc=Adk_5UhPwwUKoAs1hlzlXfGwqqchBBbuXchhlJryu3Est96JSHlULTVYnVPmDj6yVaA&_nc_zt=23&_nc_ht=scontent-sin11-2.xx&_nc_gid=K4D5xIn7ueeAX_ZBDKbXXw&oh=00_AfvUnjEtBTDwY8bYrOwTgSN8036OFLdL8EauCYbuFmiLRw&oe=698B120D	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686317563_cb5f39542ace7026522a.jpg	Kota Tua Padang adalah kawasan bersejarah di tepi Sungai Batang Arau yang penuh jejak masa lalu sebagai pelabuhan dan pusat perdagangan sejak era kolonial Belanda. Di sini tersisa deretan bangunan bergaya kolonial yang menceritakan sejarah dan keragaman budaya kota, serta suasana heritage yang kini sedang direvitalisasi menjadi destinasi wisata bersejarah yang menarik untuk dijelajahi dan difoto.	Gratis	-0.9636186241367302	100.3617489337921	2026-02-05 02:42:47.908	2026-02-06 02:19:30.076
cml8utz61000jcqhvog04ujq5	Taman Hutan Raya Bung Hatta	Alam	4.5	Jl. Raya Padang Solok	https://scontent-sin6-1.xx.fbcdn.net/v/t39.30808-6/507111851_10162602886459299_1544762528159300737_n.jpg?stp=c177.0.1086.1086a_dst-jpg_s552x414_tt6&_nc_cat=111&ccb=1-7&_nc_sid=714c7a&_nc_ohc=-vGXZhtbMVAQ7kNvwE5ocLb&_nc_oc=Admmve1M3XqzZ3-_Jb73YSZmW7Oounql7ocO4UxuuWoRyMLXcrdrR0RW98S6ocVYm1k&_nc_zt=23&_nc_ht=scontent-sin6-1.xx&_nc_gid=3Iz0uUUNegKHupAea4K8SQ&oh=00_AfvEoxg6KIJM8qqTOr6NDosF9CLU3X1XNBNO6BDDvqr_Ug&oe=698B3993	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1688295216_d82d84074713d92dc6d8.jpg	Taman Hutan Raya (Tahura) Bung Hatta merupakan kawasan konservasi alam di Kota Padang yang berfungsi sebagai pusat pelestarian flora dan fauna sekaligus wisata edukasi. Dikelilingi hutan tropis yang sejuk, Tahura Bung Hatta menawarkan keindahan alam, jalur trekking, serta sarana pembelajaran lingkungan dan penelitian alam.	Gratis	-0.9444595793480888	100.5225044488907	2026-02-05 02:45:55.64	2026-02-06 02:17:49.15
cml8v2buw000ncqhvxubjikt9	Kampung Elo Pukek	Alam	4.5	Kelurahan Purus	https://scontent-sin2-1.xx.fbcdn.net/v/t39.30808-6/491096188_10162364147924299_6321242136987982288_n.jpg?stp=c216.0.1296.1296a_dst-jpg_s552x414_tt6&_nc_cat=100&ccb=1-7&_nc_sid=714c7a&_nc_ohc=0XX9uGl5sTMQ7kNvwGgUmMW&_nc_oc=AdmBf8itak-_wjgrvwsZNaeinUfWGkHJWab-wwy7RLmW9Kowknc2hOuSKlTNkxPadl0&_nc_zt=23&_nc_ht=scontent-sin2-1.xx&_nc_gid=IdFA_Oi1nygDt2yCvByOXQ&oh=00_AfssiDM1nC89jx_429wobEpAysmKExni7kcFTipp_ykiTQ&oe=698B0ECF	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1689337418_f9777ebfa11ce95d7293.jpg	Kampung Elo Pukek merupakan destinasi wisata budaya dan kuliner khas Minangkabau yang dikenal dengan tradisi pengolahan elo pukek (ikan pukek). Kampung ini menawarkan pengalaman melihat langsung aktivitas masyarakat pesisir, mengenal kearifan lokal, serta menikmati suasana kampung yang sederhana dan autentik.	Gratis	-0.9414344573034864	100.3514063358307	2026-02-05 02:52:25.336	2026-02-06 02:21:42.346
cml8v5woy000ocqhvfecmov4n	Gunung Padang	Alam	4.5	Muaro Padang	https://scontent-sin2-3.xx.fbcdn.net/v/t39.30808-6/491752588_10162364147749299_730028450564779757_n.jpg?stp=c216.0.1296.1296a_dst-jpg_s552x414_tt6&_nc_cat=107&ccb=1-7&_nc_sid=714c7a&_nc_ohc=e1WctywA6U0Q7kNvwFA5BDc&_nc_oc=AdmGsbfIh1c29VnqZ2VQ8rcJTsX6Oif4boD6a-2s0TstFRcgaXWR4y2dBC0wveHQJV4&_nc_zt=23&_nc_ht=scontent-sin2-3.xx&_nc_gid=IdFA_Oi1nygDt2yCvByOXQ&oh=00_AfvrVrpwaEPVG8yVqrANRTIZq-YEWwSDG6reC_cjOcHPbA&oe=698B132A	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686390613_a0baebb3b9799dfc24d3.jpg	Gunung Padang adalah bukit kecil setinggi sekitar 80 m di atas permukaan laut yang menjadi salah satu ikon wisata alam Kota Padang. Lokasinya di Bukit Sitti Nurbaya, Kecamatan Padang Selatan, menawarkan pemandangan panorama kota dan laut yang indah, udara sejuk, serta jalur pendakian ringan yang cocok untuk semua kalangan. Kawasan ini tidak hanya populer sebagai tempat berolahraga, bersantai, dan berfoto, tetapi juga sarat dengan nilai sejarah dan legenda lokal seperti kisah Siti Nurbaya yang mewarnai daya tariknya sebagai destinasi wisata heritage alam di Padang.	Gratis	-0.9654959043983459	100.3495287895203	2026-02-05 02:55:12.322	2026-02-06 02:22:20.957
cml8vedih000qcqhv7hbaqwih	Arung Jeram Kec. Lubuk Kilangan	Alam	4.5	SUngai Lubuk Sarik Kelurahan Baringin Kec. Lubuk Kilangan	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1705360812_1ef679ecd508325b7537.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1705360812_1ef679ecd508325b7537.jpg	Arung Jeram Kecamatan Lubuk Kilangan merupakan destinasi wisata petualangan yang menawarkan sensasi menyusuri aliran sungai dengan arus yang menantang dan panorama alam yang asri. Dikelilingi perbukitan dan pepohonan hijau, lokasi ini cocok bagi pecinta adrenalin sekaligus wisatawan yang ingin menikmati keindahan alam secara langsung. Arung jeram di Lubuk Kilangan menjadi pilihan menarik untuk kegiatan rekreasi, wisata alam, maupun kebersamaan bersama keluarga dan komunitas.	Gratis	-0.9564902491830808	100.4232916554702	2026-02-05 03:01:47.352	2026-02-05 03:01:47.352
cml8vjlag000rcqhvl4ac5e77	Kolam Hiu	Alam	4.5	taluk Buo	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1716725647_dcc65e62095616730b72.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1716725647_dcc65e62095616730b72.jpg	Kolam Hiu merupakan destinasi wisata unik yang menawarkan pengalaman melihat hiu dari jarak dekat di dalam kolam khusus yang aman dan terawat. Tempat ini menjadi daya tarik tersendiri bagi wisatawan karena memberikan edukasi tentang kehidupan hiu sekaligus sensasi wisata yang berbeda. Kolam Hiu cocok dikunjungi oleh keluarga maupun wisatawan yang ingin menambah wawasan sambil menikmati pengalaman wisata yang seru dan berkesan.	Gratis	-1.070659430083581	100.3750365972519	2026-02-05 03:05:50.728	2026-02-05 03:05:50.728
cml8vmxmq000scqhvbpbjcmnu	Desa Wisata Teluk Buo	Alam	4.5	Teluk Buo	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1716725825_0eca591431b5c2cf0bfb.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1716725825_0eca591431b5c2cf0bfb.jpg	Desa Wisata Teluk Buo merupakan destinasi wisata berbasis alam dan budaya yang menawarkan keindahan pesisir, hutan mangrove, serta kehidupan masyarakat nelayan yang masih kental dengan kearifan lokal. Pengunjung dapat menikmati suasana desa yang asri, panorama laut yang menenangkan, serta berbagai aktivitas wisata edukatif dan budaya. Desa Wisata Teluk Buo cocok bagi wisatawan yang ingin merasakan pengalaman wisata yang alami, tenang, dan sarat nilai tradisi.	Gratis	-1.048471185754045	100.359781729409	2026-02-05 03:08:26.674	2026-02-05 03:08:26.674
cml8vqot1000tcqhvzypxjc3n	Hutan Mangrove Teluk Buo	Alam	4.5	Teluk Buo	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1716725913_afd2db4ae1bdec04a7fb.jpg	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1716725913_afd2db4ae1bdec04a7fb.jpg	Hutan Mangrove Teluk Buo merupakan destinasi wisata alam yang menawarkan keindahan ekosistem mangrove yang masih terjaga. Kawasan ini berfungsi sebagai habitat berbagai biota laut sekaligus pelindung alami pesisir. Pengunjung dapat menikmati suasana sejuk, pemandangan hijau yang menenangkan, serta kegiatan wisata edukasi lingkungan. Hutan Mangrove Teluk Buo cocok dikunjungi bagi wisatawan yang ingin berwisata sambil belajar dan menikmati alam secara lestari.	Gratis	-1.07423042408448	100.3995407046163	2026-02-05 03:11:21.877	2026-02-05 03:11:21.877
cml8wchvy000ucqhvo9ry3i86	Pasir Jambak	Alam	4.5	Keluraan Pasie Nan Tigo	https://lh3.googleusercontent.com/gps-cs-s/AHVAweoDRVZipJHFJTnuwsyyZvHwLK_TDKA9a7SZbatbPPg8b7txGf0PcB15aOCh9MtKB8KdM_qbQxUriwCJmYrejVJi0PM0Df8xuA0c_2GlLv45k51dTy_Eod_jcv4cngTzxWolfhO8kQ=w408-h306-k-no	https://lh3.googleusercontent.com/gps-cs-s/AHVAweoDRVZipJHFJTnuwsyyZvHwLK_TDKA9a7SZbatbPPg8b7txGf0PcB15aOCh9MtKB8KdM_qbQxUriwCJmYrejVJi0PM0Df8xuA0c_2GlLv45k51dTy_Eod_jcv4cngTzxWolfhO8kQ=w408-h306-k-no	Pasir Jambak adalah destinasi wisata alam yang menawarkan pemandangan pantai dan pesisir yang asri. Terkenal dengan pasir putih yang lembut, ombak yang tenang, serta suasana yang masih alami, tempat ini cocok untuk bersantai, piknik, atau berfoto. Keindahan matahari terbenam di Pasir Jambak juga menjadi daya tarik utama bagi para pengunjung yang ingin menikmati momen romantis atau menenangkan diri jauh dari hiruk-pikuk kota.	Gratis	-0.8249760707329472	100.2995324134827	2026-02-05 03:28:19.342	2026-02-05 03:28:19.342
cml8um179000hcqhvc4o29p9a	Balai Kota Padang	Budaya	4.5	Jl. Bagindo Azizchan no 1 ByPass Km 15 Aie Pacah	https://scontent-sin2-1.xx.fbcdn.net/v/t39.30808-6/487063974_10162306969149299_559007177100399104_n.jpg?stp=c216.0.1296.1296a_dst-jpg_s552x414_tt6&_nc_cat=100&ccb=1-7&_nc_sid=714c7a&_nc_ohc=MvAaraB_MgIQ7kNvwHgO2VP&_nc_oc=AdlNKrgr6ZyrEllKNOV8lsDV2jWEOlpRKcLBnB_M4Dxr_c0X6r6cvfbRdBcL3wKIV28&_nc_zt=23&_nc_ht=scontent-sin2-1.xx&_nc_gid=vj-KBehmNOiyrZ3OYiBCzA&oh=00_AfsYyQpNzK5VKmmffzKau8RP2XJkvKnMlyLbU5aR4pBCWA&oe=698B0B78	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686266892_c4aa6e6e6f75905d2d2f.jpg	Balai Kota Padang adalah gedung pemerintahan bersejarah yang dulu menjadi pusat administrasi pemerintah kota Padang dengan arsitektur peninggalan kolonial Belanda yang khas. Bangunan ini kini termasuk cagar budaya dan sebagian fungsinya telah dialihfungsikan, seperti menjadi museum dan galeri arsip sejarah Kota Padang, sekaligus menjadi simbol penting perjalanan pemerintahan dan sejarah kota.	Gratis	-0.8760289746725246	100.3875195980072	2026-02-05 02:39:45.045	2026-02-06 02:07:06.464
cml8uhepf000fcqhvayma8s8p	Rumah Kajang Padati Sungai Sapih	Alam	4.5	Sungai Sapih	https://scontent-sin11-2.xx.fbcdn.net/v/t39.30808-6/494033761_10162423731524299_6400716868385616255_n.jpg?stp=c250.0.1500.1500a_dst-jpg_s552x414_tt6&_nc_cat=101&ccb=1-7&_nc_sid=714c7a&_nc_ohc=Ya0FsbsEpPwQ7kNvwHnUNjb&_nc_oc=AdlK0-6yCOCdJIRVQ5ghA_81gszHHXdjgZyE-z-iL-5_2-TX3EZNqimafz2Fuz_q3rM&_nc_zt=23&_nc_ht=scontent-sin11-2.xx&_nc_gid=vp7mxx61PW0vfGKziUqfFw&oh=00_AfvjCd7Pqsky1E48n2IOCmE0GtSq3OkfJZ8x6OtRqzecIw&oe=698B2393	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686391058_53f8f2d714c7754d700f.jpg	Rumah Kajang Padati Sungai Sapih merupakan destinasi wisata budaya di Kota Padang yang menampilkan rumah adat khas Minangkabau pesisir. Dengan atap pelana khas kajang padati dan arsitektur tradisional dari bahan alami, rumah ini mencerminkan nilai sejarah, adat, dan kearifan lokal masyarakat setempat, sekaligus menjadi sarana edukasi dan pelestarian budaya Minangkabau.	Gratis	-0.8965293274260544	100.3892683982849	2026-02-05 02:36:09.267	2026-02-06 02:12:31.085
cml8uud1w000kcqhvb5r1vg9d	Bendungan Patamuan	Alam	4.5	Batu busuk Kelurahan Lambung Bukit Kec. Pauh	https://scontent-sin6-2.xx.fbcdn.net/v/t39.30808-6/508393309_10162612061859299_3534107765814935224_n.jpg?stp=c386.0.967.967a_dst-jpg_s552x414_tt6&_nc_cat=109&ccb=1-7&_nc_sid=714c7a&_nc_ohc=4c817-ME1qQQ7kNvwFFY2Lb&_nc_oc=Adkv7fiJEXBB80SkZY-w-vLvKdIzqP1QeVCIc9v9fbtkCgf7AtCt4Iwo5UOkIUaktaE&_nc_zt=23&_nc_ht=scontent-sin6-2.xx&_nc_gid=Yheh-4_PNguy0xyMz6bTzQ&oh=00_Afu9ktdMLh_2lNCccypfeTKJcXNiR9t9LzY7iUHnpbIhiQ&oe=698B151A	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686318647_75dd26df67b82a692dbc.jpg	Bendungan Patamuan adalah struktur bendungan di wilayah Patamuan yang terkenal dengan pemandangan alamnya yang asri dan aliran air sungai yang jernih, sering dikunjungi sebagai tempat menikmati suasana pedesaan dan aktivitas air seperti berenang di kolam alami di sekitar bendungan. Akses ke lokasi bisa dicapai dengan kendaraan roda dua atau empat dari sekitar Kampus Universitas Andalas, menyusuri jalan pedesaan yang menawarkan pemandangan hijau bukit, sawah, dan sungai. Banyak pengunjung memuji airnya yang sejuk dan pemandangan yang indah di kawasan ini, menjadikannya spot rekreasi alam sederhana dekat kota.	Gratis	-0.881360579143441	100.4705339670181	2026-02-05 02:46:13.652	2026-02-06 02:18:49.44
cml8ujovf000gcqhvtwmjfnvp	Bendungan Koto Tuo Lubuk Minturun	Alam	4.5	Lubuk Minturun	https://scontent-sin11-2.xx.fbcdn.net/v/t39.30808-6/506685736_10162598117049299_7001505111330458106_n.jpg?stp=c420.0.1080.1080a_dst-jpg_s552x414_tt6&_nc_cat=101&ccb=1-7&_nc_sid=714c7a&_nc_ohc=8SEStcDXl8EQ7kNvwHc2kOO&_nc_oc=AdmGiUxugTyp5S5rVDmgEIkv4hBTRg39NXFG0IwNnyx_QVdjd-zUlN732YqfRp9EcVc&_nc_zt=23&_nc_ht=scontent-sin11-2.xx&_nc_gid=1jpyy7WrWRReGFPNDaZGDA&oh=00_AfuEBfh50sahz4gwFIbkISesVh6I_60N7nuNHVuDpOvzwA&oe=698B282D	https://destinasi.pariwisata.padang.go.id/api-destinasi//img360/1686266425_4eccc380986ed39cf6cb.jpg	Bendungan Koto Tuo Lubuk Minturun adalah struktur bendungan irigasi di Kelurahan Koto Panjang Ikua Koto, Kecamatan Koto Tangah, Kota Padang yang berfungsi mengatur aliran air untuk keperluan pertanian dan perekonomian masyarakat sekitar. Bendungan ini sering menjadi titik aktivitas warga dan dikenal sebagai bagian dari lanskap alam Lubuk Minturun yang asri serta jadi tempat singgah bagi pengunjung yang ingin menikmati pemandangan air dan suasana tenang. Infrastruktur ini juga menjadi fokus perbaikan dan pemeliharaan pemerintah untuk memastikan pasokan air tetap lancar bagi sawah dan lahan di wilayah sekitarnya.	Gratis	-0.8402952308433812	100.3675264120102	2026-02-05 02:37:55.755	2026-02-06 02:24:29.191
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Event" (id, name, date, location, image, description, price, "createdAt") FROM stdin;
cml6hzxwf0000n0delsrrng8l	Marathon Kota Tua Padang	2025-02-14 00:00:00	Kota Tua Batang Arau	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOW4Ys2C6xn1TNKrmeAUzZI91ws218zFQjfg&s	acara ini berlangsung tiap tahun	Gratis	2026-02-03 11:11:06.591
cmla9sg2e0014cqhvgeawdmq9	Nongkrong Kretif	2026-02-09 23:00:00	Kota Tua	https://scontent-sin11-2.xx.fbcdn.net/v/t39.30808-6/629574985_122215685894340484_7789035950778985184_n.jpg?stp=cp6_dst-jpg_s1080x2048_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=87KkHfo0h4kQ7kNvwEgc2j2&_nc_oc=AdkJEjWgkxyDpR2EMjee83UgjtgT4OCs-ijrn5wvDS-fDh_UYSoSGiMWpn3-iA4i49I&_nc_zt=23&_nc_ht=scontent-sin11-2.xx&_nc_gid=HBSFYGbuq161naUSzytmMw&oh=00_AftXV-uDPyCVV8b1tCUJZ4mIfK3EPv6AxPwULdcZabVtWw&oe=698B1461	Tahun 2025 menjadi saksi bagaimana Nongkrong Kreatif Season 1 berhasil menghidupkan kembali denyut nadi seni di tengah kita.\n\nTawa, tepuk tangan, dan decak kagum #SobatParwis semua adalah alasan kenapa kami kembali. ❤️\n\nUntuk menjawab kerinduan itu, Dinas Pariwisata Kota Padang dengan bangga mempersembahkan Opening Ceremony Nongkrong Kreatif Season 2.\n\nMalam minggu ini akan terasa lebih istimewa karena kita memilih lokasi yang sarat sejarah dan romansa. Mari berkumpul di Taman Kota Tua, Batang Arau, persis di sebelah gedung ikonik Padangsche Spaarbank.\n\nDi bawah cahaya lampu kota tua, kita nikmati kembali harmonisasi budaya Minang, Nias, dan Tionghoa.\n\nCatat tanggal mainnya:\n📅 Sabtu, 7 Februari 2026\n⏰ Pukul 20.00 WIB s.d. Selesai\n📍Taman Kota Tua, (samping Padangsche Spaarbank), Batang Arau.\n\nMari kita buat kenangan baru yang tak kalah indah dari season sebelumnya!\n\n#NongkrongKreatif #pariwisatapadang #PadangKotaKreatif #padang	Gratis	2026-02-06 02:32:24.662
\.


--
-- Data for Name: Guide; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Guide" (id, "userId", status, "verificationLevel", bio, languages, specializations, "yearsExperience", "videoIntroUrl", certifications, "averageRating", "totalTours", "totalReviews", "responseRate", "responseTime", "createdAt") FROM stdin;
cmld9u94c0001ybj875t942lo	cml3uu1zx00005yx8g084irsj	APPROVED	BASIC	saya lama dipadang	{"Bahasa Indonesia",English}	{Budaya,Kuliner}	1	\N	\N	0	0	0	0	\N	2026-02-08 04:57:07.5
\.


--
-- Data for Name: GuideEarning; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GuideEarning" (id, "guideId", "userId", amount, type, status, "withdrawnAt", notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: GuideReview; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GuideReview" (id, "guideId", "reviewerId", rating, comment, "createdAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Message" (id, "conversationId", "senderId", content, attachments, "isRead", "createdAt") FROM stdin;
cmldqgq9p0005eoleydh4p5l2	cmldqgith0001eoled2jens1r	cml3v6oqb00015yx82wzgqmwn	Test	\N	f	2026-02-08 12:42:30.013
cmldqniz00007eolenvdizvt5	cmldqgith0001eoled2jens1r	cml3uu1zx00005yx8g084irsj	ya	\N	f	2026-02-08 12:47:47.148
\.


--
-- Data for Name: PackageReview; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PackageReview" (id, "packageId", "bookingId", "userId", "guideId", "overallRating", "communicationRating", "punctualityRating", "knowledgeRating", "valueRating", comment, photos, "isVerified", "helpfulCount", "guideReply", "guideReplyAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, "bookingId", amount, "platformFee", "guidePayout", method, status, "paymentGateway", "transactionId", "paidAt", "releasedToGuide", "createdAt") FROM stdin;
\.


--
-- Data for Name: Plan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Plan" (id, "userId", date, title, "createdAt") FROM stdin;
cml5554xa000113bvc5tf42vj	cml537g5v000021rtf5eopb8a	40520-02-02	Jalan-Jalan Sore	2026-02-02 12:23:27.776
cml55bmic000313bvj09p8e1q	cml537g5v000021rtf5eopb8a	2026-02-03	Liburan Padang	2026-02-02 12:28:30.473
cml55r1q1000d13bvjadohtpp	cml537g5v000021rtf5eopb8a	2024-06-02	Wisata Kuliner Legendaris	2026-02-02 12:40:30.064
cml55th65000j13bv3jidxq7g	cml537g5v000021rtf5eopb8a	2026-02-03	City Tour Padang	2026-02-02 12:42:23.405
cml5d71fn000412yjcz9wpiax	cml3uu1zx00005yx8g084irsj	2026-02-03	Wisata Kuliner Legendaris	2026-02-02 16:08:53.506
cml6i9wls0002n0det3p58adm	cml3u71g10003mns1xxlit0f6	2026-02-04	Wisata Kuliner Legendaris	2026-02-03 11:18:51.472
cml82p6mh0001cqhv59y91uv2	cml3v6oqb00015yx82wzgqmwn	2026-02-05	City Tour Padang	2026-02-04 13:38:22.793
cmla5b5b9000zcqhvnfbw5xo6	cmla57k81000xcqhvzxxeo370	2026-02-07	Wisata Kuliner Legendaris	2026-02-06 00:26:59.109
cmlamk0ym0017cqhv50tjciln	cml8u41eu000ccqhvfcv4l10m	2026-02-07	City Tour Padang	2026-02-06 08:29:46.846
cmlamnpr2001dcqhvvotu6ufc	cml8u41eu000ccqhvfcv4l10m	2026-02-12	Escape to Nature	2026-02-06 08:32:38.943
cmlamohnt001icqhvx6jrwp5p	cmlamhkp60015cqhvsmaxrfuc	2026-02-07	City Tour Padang	2026-02-06 08:33:15.113
cmlamqxro001ocqhvah3raih6	cml8u41eu000ccqhvfcv4l10m	2026-02-05	Libur	2026-02-06 08:35:09.3
\.


--
-- Data for Name: PlanItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlanItem" (id, "planId", "time", place, activity) FROM stdin;
cml55bmic000413bvpaon3gaw	cml55bmic000313bvj09p8e1q	08:27	Pusat Oleh-oleh	
cml55bmic000513bv308rq14y	cml55bmic000313bvj09p8e1q	09:29	Pasar Raya	
cml55r1q1000e13bvzhdgwwcv	cml55r1q1000d13bvjadohtpp	07:30	Katupek Pitalah Purus	Sarapan Khas
cml55r1q1000f13bv98r43t7u	cml55r1q1000d13bvjadohtpp	12:00	RM Lamun Ombak	Makan Siang Besar
cml55r1q1000g13bv7dpjiv6y	cml55r1q1000d13bvjadohtpp	16:00	Es Durian Ganti Nan Lamo	Dessert Sore
cml55r1q1000h13bv2utlqhp6	cml55r1q1000d13bvjadohtpp	19:00	Martabak Kubang Hayuda	Makan Malam
cml55th65000k13bv90np5339	cml55th65000j13bv3jidxq7g	09:00	Masjid Raya Sumbar	Wisata Religi & Arsitektur
cml55th65000l13bvokd40oah	cml55th65000j13bv3jidxq7g	11:30	Museum Adityawarman	Belajar Budaya Minang
cml55th65000m13bvjjgj05t3	cml55th65000j13bv3jidxq7g	16:00	Jembatan Siti Nurbaya	Pemandangan Kota
cml55th65000n13bv8l2wtpyd	cml55th65000j13bv3jidxq7g	17:30	Pantai Padang (Taplau)	Sunset
cml5d71fn000512yjwyg117bo	cml5d71fn000412yjcz9wpiax	08:00	Katupek Pitalah Purus	Sarapan Khas
cml5d71fn000612yjz64gijaq	cml5d71fn000412yjcz9wpiax	12:00	RM Lamun Ombak	Makan Siang Besar
cml5d71fn000712yjrv010pec	cml5d71fn000412yjcz9wpiax	16:00	Es Durian Ganti Nan Lamo	Dessert Sore
cml5d71fn000812yj9b7de54n	cml5d71fn000412yjcz9wpiax	19:00	Martabak Kubang Hayuda	Makan Malam
cml6i9wls0003n0dehwjdcog1	cml6i9wls0002n0det3p58adm	08:00	Katupek Pitalah Purus	Sarapan Khas
cml6i9wls0004n0dekd9a85xp	cml6i9wls0002n0det3p58adm	12:00	RM Lamun Ombak	Makan Siang Besar
cml6i9wls0005n0deqnxmhjlg	cml6i9wls0002n0det3p58adm	16:00	Es Durian Ganti Nan Lamo	Dessert Sore
cml6i9wls0006n0debtoyuuyp	cml6i9wls0002n0det3p58adm	19:00	Martabak Kubang Hayuda	Makan Malam
cml82p6mh0002cqhvh3v52e09	cml82p6mh0001cqhv59y91uv2	09:00	Masjid Raya Sumbar	Wisata Religi & Arsitektur
cml82p6mh0003cqhv0yy91yvc	cml82p6mh0001cqhv59y91uv2	11:00	Museum Adityawarman	Belajar Budaya Padang
cml82p6mh0004cqhv13ude0f6	cml82p6mh0001cqhv59y91uv2	16:00	Jembatan Siti Nurbaya	Pemandangan Kota
cml82p6mh0005cqhv8xdfbd71	cml82p6mh0001cqhv59y91uv2	17:30	Pantai Padang (Taplau)	Sunset
cmla5b5b90010cqhvq2ksvn5h	cmla5b5b9000zcqhvnfbw5xo6	08:00	Katupek Pitalah Purus	Sarapan Khas
cmla5b5b90011cqhvzi1qpudi	cmla5b5b9000zcqhvnfbw5xo6	12:00	RM Lamun Ombak	Makan Siang Besar
cmla5b5b90012cqhvxgkgky4w	cmla5b5b9000zcqhvnfbw5xo6	16:00	Es Durian Ganti Nan Lamo	Dessert Sore
cmla5b5b90013cqhvolooshdj	cmla5b5b9000zcqhvnfbw5xo6	19:00	Martabak Kubang Hayuda	Makan Malam
cmlamk0ym0018cqhvs19r7e9g	cmlamk0ym0017cqhv50tjciln	09:00	Masjid Raya Sumbar	Wisata Religi & Arsitektur
cmlamk0ym0019cqhvy1tf1lzh	cmlamk0ym0017cqhv50tjciln	11:00	Museum Adityawarman	Belajar Budaya Padang
cmlamk0ym001acqhvcyouvg3l	cmlamk0ym0017cqhv50tjciln	16:00	Jembatan Siti Nurbaya	Pemandangan Kota
cmlamk0ym001bcqhv39teykkd	cmlamk0ym0017cqhv50tjciln	17:30	Pantai Padang (Taplau)	Sunset
cmlamnpr2001ecqhvnfvghvhb	cmlamnpr2001dcqhvvotu6ufc	08:30	Pantai Air Manis	Batu Malin Kundang
cmlamnpr2001fcqhvvwohp25w	cmlamnpr2001dcqhvvotu6ufc	13:00	Bukit Gado-Gado	Trekking Ringan & View
cmlamnpr2001gcqhvgip0w4o9	cmlamnpr2001dcqhvvotu6ufc	16:20	Pantai Caroline	Santai Sore
cmlamohnt001jcqhvpui4pbkk	cmlamohnt001icqhvx6jrwp5p	09:00	Masjid Raya Sumbar	Wisata Religi & Arsitektur
cmlamohnt001kcqhv7rnl027s	cmlamohnt001icqhvx6jrwp5p	11:00	Museum Adityawarman	Belajar Budaya Padang
cmlamohnt001lcqhv1s3s76ct	cmlamohnt001icqhvx6jrwp5p	16:00	Jembatan Siti Nurbaya	Pemandangan Kota
cmlamohnt001mcqhv9wv2ppjn	cmlamohnt001icqhvx6jrwp5p	17:30	Pantai Padang (Taplau)	Sunset
cmlamqxro001pcqhvf5sz6ecq	cmlamqxro001ocqhvah3raih6	20:33	GOR	
cmlamqxro001qcqhvh7jq32bf	cmlamqxro001ocqhvah3raih6	21:34	bebek sawah	
cmlamqxro001rcqhvslnyytgt	cmlamqxro001ocqhvah3raih6	12:34	masjid raya sumbar	
cmlamqxro001scqhvf6hfnos6	cmlamqxro001ocqhvah3raih6	14:40	makan di pantai padang	
\.


--
-- Data for Name: Promotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Promotion" (id, title, discount, image, provider, "createdAt", "videoUrl") FROM stdin;
cml3u712f0002mns1im8cs3w3	Road To Gastronomy City	Special Event	data:image/jpeg;base64,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	Dinas Pariwisata	2026-02-01 14:29:14.151	https://www.youtube.com/watch?v=hBCOnW7TDZI
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Review" (id, "userId", "destinationId", rating, comment, "createdAt") FROM stdin;
cml52oxdk0001kyx3ce900gbl	cml3uu1zx00005yx8g084irsj	cml3u712a0001mns195hip88g	5	Pantai yang sangat indah dan bersih. Cocok untuk keluarga!	2026-02-02 11:14:52.205
cml52rxv80003kyx3lhrudbbj	cml3uu1zx00005yx8g084irsj	cml3u712a0001mns195hip88g	5	keren	2026-02-02 11:17:12.883
cml53hggn00016hbw07dgwy2d	cml537g5v000021rtf5eopb8a	cml3u712a0001mns195hip88g	5	Pantainya sangat indah dan bersih! Sanagt direkomendasikan untu	2026-02-02 11:37:03.381
cml5crrws000212yjf3xz5bxq	cml3u71g10003mns1xxlit0f6	cml57nzji000012yjhbwl33u2	5	mantapppp	2026-02-02 15:57:01.322
cml82tsjl0007cqhvkewlhncb	cml3v6oqb00015yx82wzgqmwn	cml57nzji000012yjhbwl33u2	5	Keren	2026-02-04 13:41:57.826
cml8x9c9n000wcqhv83e2cx2q	cml8u41eu000ccqhvfcv4l10m	cml8u2q9b000bcqhvdlt3hffv	5	Masjid nya adem banget si jujur	2026-02-05 03:53:51.707
\.


--
-- Data for Name: Story; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Story" (id, "userId", caption, location, "viewCount", "createdAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: StoryComment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StoryComment" (id, "storyId", "userId", content, "createdAt") FROM stdin;
\.


--
-- Data for Name: StoryLike; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StoryLike" (id, "storyId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: StoryMedia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StoryMedia" (id, "storyId", url, type, "order") FROM stdin;
\.


--
-- Data for Name: TourPackage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TourPackage" (id, "guideId", title, category, tags, description, duration, "durationType", "maxParticipants", "basePrice", "groupDiscount", "meetingPoint", "meetingPointLat", "meetingPointLng", itinerary, inclusions, exclusions, requirements, photos, "availableDays", status, "averageRating", "totalBookings", "createdAt", "updatedAt") FROM stdin;
cmldb2ohs0002aykog1191wrk	cmld9u94c0001ybj875t942lo	City Tour Kota Tua Padang	Cultural	{}	Tour Kota Tua Padang membawa Anda menyelusuri jejak sejarah kolonial Belanda di sepanjang tepian Batang Arau, Padang Selatan. Jelajahi arsitektur klasik abad ke-19, kunjungi Klenteng See Hien Kiong di Kampung Pondok, dan nikmati suasana sore di jembatan Siti Nurbaya yang ikonik dengan latar kapal-kapal bersandar. \nBerikut adalah deskripsi lengkap untuk tur Kota Tua Padang:\nDestinasi Utama: Meliputi kawasan Batang Arau, Jalan Kelenteng II, dan Jalan Ps. Borong III yang kaya akan bangunan kolonial, banyak di antaranya telah dialihfungsikan menjadi kafe estetis.\nPengalaman Wisata:\nMenyusuri Sejarah: Melihat langsung sisa-sisa kejayaan perdagangan masa lalu, termasuk gudang-gudang tua dan bangunan bergaya Eropa yang bertahan dari gempa.\nKunjungan Budaya: Menjelajahi Kampung Pondok (Pecinan) dan Klenteng See Hien Kiong yang dibangun tahun 1861.\nWisata Kuliner & Foto: Hunting foto bernuansa vintage di depan gedung tua dan menikmati kopi atau kuliner lokal di kafe sekitar kawasan.\nMenikmati Batang Arau: Menikmati pemandangan sungai dan kapal yang bersandar, sering disebut mirip dengan Marina Bay Singapura.\nAktivitas Pendukung: Pengunjung dapat menyewa skuter untuk berkeliling kawasan yang tertata rapi.\nWaktu Terbaik: Sore hingga malam hari untuk menghindari panas matahari dan menikmati suasana kafe yang hidup. \nKawasan ini sangat cocok bagi pecinta sejarah, fotografer, dan wisatawan yang ingin merasakan sisi klasik Kota Padang. 	3	HOUR	5	100000	null	Depan Gerbang Museum BI Muara	-0.965206266939849	100.3588199615479	[{"time": "09:00", "place": "Jembatan Siti Nurbaya", "activity": "Berkumpul"}, {"time": "09:12", "place": "Kota Tua", "activity": "Mulai menjelajahi kota tua"}, {"time": "10:00", "place": "Tanah Kongsi", "activity": "Menikmati kuliner khas padang"}]	{"Makan Siang dan Snack"}	{"Transportasi ke titik kumpul"}	{"minAge": "10", "fitnessLevel": "Sedang"}	{"data:image/jpeg;base64,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"}	{}	ACTIVE	0	0	2026-02-08 05:31:40.289	2026-02-08 05:31:40.289
\.


--
-- Data for Name: TravelBuddyApplication; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TravelBuddyApplication" (id, "postId", "userId", message, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: TravelBuddyPost; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TravelBuddyPost" (id, "userId", "destinationId", title, description, "startDate", "endDate", "maxBuddies", status, requirements, "budgetRange", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, level, points, avatar, "createdAt", email, password, phone, "updatedAt", role, "subjectDate", "subjectTitle") FROM stdin;
cml8u41eu000ccqhvfcv4l10m	atsil	1	0	\N	2026-02-05 02:25:45.51	atsil@gmail.com	$2b$10$IupXULkmW3C4z3vwtKrDzuAWg9QRCPGg.Vr8cREDKtvLNFh.2HyFu	\N	2026-02-05 02:25:45.51	USER	\N	\N
cmla57k81000xcqhvzxxeo370	Fajri	1	0	\N	2026-02-06 00:24:11.81	muhammadfajriharahap@gmail.com	$2b$10$LZEy6YmECA4uiLQGZ1TU2OiFPdZfLV2y56lKgpPkSeA.5zROW/K2u	\N	2026-02-06 00:24:11.81	USER	\N	\N
cml3uu1zx00005yx8g084irsj	ARI	1	0	\N	2026-02-01 14:47:08.445	ari@gmail.com	$2b$10$2meoDVQFo1KYmRw2rThcUuiHi.sdgH/BFIEz3c9Pi94wmRXqVDHLa	\N	2026-02-01 14:47:08.445	USER	\N	\N
cml3v6oqb00015yx82wzgqmwn	romy	1	0	\N	2026-02-01 14:56:57.779	romy@tic.com	$2b$10$lQa9.iB.KlXaoTWrZRDEYOEgCSsViFENh7.7kn2XcQT9B2OLhTZMq	\N	2026-02-01 14:56:57.779	USER	\N	\N
cml537g5v000021rtf5eopb8a	Test User	1	0	\N	2026-02-02 11:29:16.413	test@test.com	$2b$10$Ow1Nyb4GGw5oFuAhJZqYsOQoH/kYLJZez4R88.7q.o9GEeWB1IQIS	\N	2026-02-02 11:29:16.413	USER	\N	\N
cml3u71g10003mns1xxlit0f6	Super Admin TIC	1	0	https://api.dicebear.com/7.x/avataaars/svg?seed=Admin	2026-02-01 14:29:14.642	admin@tic.com	$2b$10$NNBzxxe4R5fA7NYLuvP5n.4sgG8TA0oxhoQJs503ORXgFmINz1plC	\N	2026-02-01 14:29:14.642	ADMIN	\N	\N
cmlamhkp60015cqhvsmaxrfuc	Rika Novita Sari 	1	0	\N	2026-02-06 08:27:52.458	rikanovitasari31@gmail.com	$2b$10$k1nF1EgX8IwLmUNEMcFirONkVPREIy9rb8PAPVZGayJFI/4C/A7zW	\N	2026-02-06 08:27:52.458	USER	\N	\N
cmlan5892001tcqhvlpt99xkv	Siti Gloria	1	0	\N	2026-02-06 08:46:16.07	sitigloria29@gmail.com	$2b$10$5q1xNMyQvna09fk.yptVU.pVmq7gvPKlAmubsO068oDG7fHKzFE26	\N	2026-02-06 08:46:16.07	USER	\N	\N
cmlburizs0000xemabuo8lhct	Charlie	1	0	\N	2026-02-07 05:07:19.912	charlie@padang.com	$2b$10$1NFoh9p.4sh4dt6hlOjpme1skwr9Nrtt0jUSn8wEZQ2HAETw7IUEa	\N	2026-02-07 05:07:19.912	USER	\N	\N
cmld0jjl10001xematutzgvbr	ari2	1	0	\N	2026-02-08 00:36:51.301	ari2@tic.com	$2b$10$qre8ySn280/5JilHMg1Ro.b0hJHjhi3HBHpLaO65LDRkp3oLVxywW	\N	2026-02-08 00:49:17.304	USER	\N	\N
cmleh3ldg0002xemawjgntld2	Vegi	1	0	\N	2026-02-09 01:08:06.773	vegicwannda@gmail.com	$2b$10$6/C3k2goSr/AJtaKEbcSUuaO3IwYwWhIZAvMObP.oXx8EEPtt/4IK	\N	2026-02-09 01:08:06.773	USER	\N	\N
cmleoserx0005xema6uh1nc58	Rina Melati 	1	0	\N	2026-02-09 04:43:21.933	rinamelati1980@gmail.com	$2b$10$8tp2h54ZB0Yjrm4p2A287eKHvHw087Qv0PoYyaV2jM93O9ytnUbxC	\N	2026-02-09 04:43:21.933	USER	\N	\N
cmlesirqm0008xemabyx2m8e7	Diko Riva Utama	1	0	\N	2026-02-09 06:27:50.638	dikorivautama@gmail.com	$2b$10$b1IyYMH7rhWIV0p6aILlw.8D4wZDM5nPpyS4vZAfElweJVjwyYJ2i	\N	2026-02-09 06:27:50.638	USER	\N	\N
cmlfx6ixz0009xemathtbthsa	Farrel Maulana	1	0	\N	2026-02-10 01:26:03.624	farrelmaulana811@gmail.com	$2b$10$OFbtqOrTJvGlSgU4BY.Z6uVOfGLj1nBrwXjCvkwu520gSA3U70PhW	\N	2026-02-10 01:26:03.624	USER	\N	\N
cmlfxauxf000bxemazcy5i8uo	Maketta Janakova Sky Denver	1	0	\N	2026-02-10 01:29:25.78	makettajanakova13@gmail.com	$2b$10$yvnHisV57rqxREVNzdfP7uWFmIaBdqJQLkC8XxaduyWbs3vjpx/9K	\N	2026-02-10 01:29:25.78	USER	\N	\N
cmlfxbl38000cxemadg6tko7m	Tiara Aulia Rahmah	1	0	\N	2026-02-10 01:29:59.685	tiaraauliarahmah53@gmail.com	$2b$10$L8Wuxpevn5zI54TS9.JKXeCrxJewkWTuKWkhI7JDSMcjxBbAPsT2W	\N	2026-02-10 01:29:59.685	USER	\N	\N
cmlfxc8or000dxemakk2zty3g	Eka Putri Wahyuni	1	0	\N	2026-02-10 01:30:30.267	ekaputriwahyuni0122@gmail.com	$2b$10$ri7pFbe2OF9S0EnVV/sMVeFBL.KtznrqlnNCivc8Mqcc9qzifWyTm	\N	2026-02-10 01:30:30.267	USER	\N	\N
cmlfxcq8m000exemap9akf330	Nurfa Rahma Julita	1	0	\N	2026-02-10 01:30:53.015	nurfarahmajulita13@gmail.com	$2b$10$9Pih/kzd7yiN.48SVNyzEuCTJbhQDCG6r3p39UMats51fcsSM/2KK	\N	2026-02-10 01:30:53.015	USER	\N	\N
cmlfxd5i1000fxema7raqf4d2	Reyvalina	1	0	https://api.dicebear.com/7.x/avataaars/svg?seed=Bandung	2026-02-10 01:31:12.793	reyvalina04@gmail.com	$2b$10$7iDWzkEiDUhz61pNXhRCqOpMdYvClk9jwlDeXuifLwuYkwNL2OMvW	\N	2026-02-10 01:43:10.589	USER	\N	\N
cmlfxaul8000axemancmv1k3d	Hana Afifah	1	0	https://api.dicebear.com/7.x/avataaars/svg?seed=Siti	2026-02-10 01:29:25.341	afifahhana10@gmail.com	$2b$10$rTRTB/WrPqsPfZNWiguv2uXTiPVFckdqJafIXFJDFciYki3ldh86a	\N	2026-02-10 01:43:49.51	USER	\N	\N
cmlfyvgjk000kxemayxcfhpty	Wahyu Kurniawan	1	0	\N	2026-02-10 02:13:26.529	wahyudevilhunter840@gmail.com	$2b$10$eTkEd8YKBySYy6Z829NgMuIjFsCa/Tfh0xMQzsOe0/uoBS7EWEN.2	\N	2026-02-10 02:13:26.529	USER	\N	\N
cmlg1q93d000rxemaiv7bzgn8	Hendry	1	0	\N	2026-02-10 03:33:22.441	mhendry776@gmail.com	$2b$10$4WLhu4UWawetj5mXFM5C..qzT88tQ19xCAJXVfRXB80L7wj6t89eK	\N	2026-02-10 03:33:22.441	USER	\N	\N
cmlgc58b4000sxemar26gx8mv	danil sulhendra	1	0	\N	2026-02-10 08:24:57.424	danilsulhendra@gmail.com	$2b$10$FUMu1j9KOQAG1S2r5w6SleLXq3M1Jje7WVBcwXx1o5fiXw0NpcO9O	\N	2026-02-10 08:24:57.424	USER	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
611ab060-3184-4a14-9457-92cccfe4d0e5	5b4fab6c672f4d866b2755f58f161c6ca06fef01debe1b731c677dbfc8b2c641	2026-02-01 21:12:20.812848+07	20260201141220_init	\N	\N	2026-02-01 21:12:20.789154+07	1
64161ee3-ebe6-4020-89e2-f2e0ad535f0f	ce3aba0191d79b732cc85fb2c073abba15132ab0659823731b4b0fcd25f1ad0e	2026-02-01 21:17:31.364171+07	20260201141731_add_user_auth	\N	\N	2026-02-01 21:17:31.348387+07	1
6d981058-9b92-4398-8755-baceb83ce0f5	802f29aaa4a40f58f02b8d7e7ff51f0d3d200901059efe04cd425787d26c0598	2026-02-01 21:28:52.068652+07	20260201142852_add_user_role	\N	\N	2026-02-01 21:28:52.059329+07	1
\.


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: BookingMessage BookingMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookingMessage"
    ADD CONSTRAINT "BookingMessage_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: ConversationMember ConversationMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ConversationMember"
    ADD CONSTRAINT "ConversationMember_pkey" PRIMARY KEY (id);


--
-- Name: Conversation Conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY (id);


--
-- Name: Destination Destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Destination"
    ADD CONSTRAINT "Destination_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: GuideEarning GuideEarning_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GuideEarning"
    ADD CONSTRAINT "GuideEarning_pkey" PRIMARY KEY (id);


--
-- Name: GuideReview GuideReview_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GuideReview"
    ADD CONSTRAINT "GuideReview_pkey" PRIMARY KEY (id);


--
-- Name: Guide Guide_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Guide"
    ADD CONSTRAINT "Guide_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: PackageReview PackageReview_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PackageReview"
    ADD CONSTRAINT "PackageReview_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PlanItem PlanItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanItem"
    ADD CONSTRAINT "PlanItem_pkey" PRIMARY KEY (id);


--
-- Name: Plan Plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_pkey" PRIMARY KEY (id);


--
-- Name: Promotion Promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: StoryComment StoryComment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryComment"
    ADD CONSTRAINT "StoryComment_pkey" PRIMARY KEY (id);


--
-- Name: StoryLike StoryLike_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryLike"
    ADD CONSTRAINT "StoryLike_pkey" PRIMARY KEY (id);


--
-- Name: StoryMedia StoryMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryMedia"
    ADD CONSTRAINT "StoryMedia_pkey" PRIMARY KEY (id);


--
-- Name: Story Story_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Story"
    ADD CONSTRAINT "Story_pkey" PRIMARY KEY (id);


--
-- Name: TourPackage TourPackage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourPackage"
    ADD CONSTRAINT "TourPackage_pkey" PRIMARY KEY (id);


--
-- Name: TravelBuddyApplication TravelBuddyApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TravelBuddyApplication"
    ADD CONSTRAINT "TravelBuddyApplication_pkey" PRIMARY KEY (id);


--
-- Name: TravelBuddyPost TravelBuddyPost_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TravelBuddyPost"
    ADD CONSTRAINT "TravelBuddyPost_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ConversationMember_conversationId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ConversationMember_conversationId_userId_key" ON public."ConversationMember" USING btree ("conversationId", "userId");


--
-- Name: Guide_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Guide_userId_key" ON public."Guide" USING btree ("userId");


--
-- Name: PackageReview_bookingId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PackageReview_bookingId_key" ON public."PackageReview" USING btree ("bookingId");


--
-- Name: Payment_bookingId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Payment_bookingId_key" ON public."Payment" USING btree ("bookingId");


--
-- Name: StoryLike_storyId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StoryLike_storyId_userId_key" ON public."StoryLike" USING btree ("storyId", "userId");


--
-- Name: TravelBuddyApplication_postId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TravelBuddyApplication_postId_userId_key" ON public."TravelBuddyApplication" USING btree ("postId", "userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: BookingMessage BookingMessage_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookingMessage"
    ADD CONSTRAINT "BookingMessage_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BookingMessage BookingMessage_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookingMessage"
    ADD CONSTRAINT "BookingMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public."TourPackage"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public."Article"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ConversationMember ConversationMember_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ConversationMember"
    ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ConversationMember ConversationMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ConversationMember"
    ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Conversation Conversation_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GuideEarning GuideEarning_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GuideEarning"
    ADD CONSTRAINT "GuideEarning_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GuideEarning GuideEarning_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GuideEarning"
    ADD CONSTRAINT "GuideEarning_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GuideReview GuideReview_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GuideReview"
    ADD CONSTRAINT "GuideReview_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GuideReview GuideReview_reviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GuideReview"
    ADD CONSTRAINT "GuideReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Guide Guide_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Guide"
    ADD CONSTRAINT "Guide_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackageReview PackageReview_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PackageReview"
    ADD CONSTRAINT "PackageReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackageReview PackageReview_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PackageReview"
    ADD CONSTRAINT "PackageReview_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackageReview PackageReview_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PackageReview"
    ADD CONSTRAINT "PackageReview_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public."TourPackage"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PackageReview PackageReview_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PackageReview"
    ADD CONSTRAINT "PackageReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PlanItem PlanItem_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanItem"
    ADD CONSTRAINT "PlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Plan Plan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_destinationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES public."Destination"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StoryComment StoryComment_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryComment"
    ADD CONSTRAINT "StoryComment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public."Story"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StoryComment StoryComment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryComment"
    ADD CONSTRAINT "StoryComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StoryLike StoryLike_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryLike"
    ADD CONSTRAINT "StoryLike_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public."Story"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StoryLike StoryLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryLike"
    ADD CONSTRAINT "StoryLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StoryMedia StoryMedia_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryMedia"
    ADD CONSTRAINT "StoryMedia_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public."Story"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Story Story_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Story"
    ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TourPackage TourPackage_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourPackage"
    ADD CONSTRAINT "TourPackage_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TravelBuddyApplication TravelBuddyApplication_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TravelBuddyApplication"
    ADD CONSTRAINT "TravelBuddyApplication_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."TravelBuddyPost"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TravelBuddyApplication TravelBuddyApplication_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TravelBuddyApplication"
    ADD CONSTRAINT "TravelBuddyApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TravelBuddyPost TravelBuddyPost_destinationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TravelBuddyPost"
    ADD CONSTRAINT "TravelBuddyPost_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES public."Destination"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TravelBuddyPost TravelBuddyPost_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TravelBuddyPost"
    ADD CONSTRAINT "TravelBuddyPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict rgtMBri6VtoF6limOxLrFf3pBjp6FPFgNdXohUcuofCaclXHOq5c6XNi3Rga7Pl

