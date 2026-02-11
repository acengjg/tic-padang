--
-- PostgreSQL database dump
--

\restrict 3EN58nNXqdHNGvc97vCx3edoF7e1iC71fe7h9LCPF4bOMTxDWdmRawS1I5ahXpR

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

ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_destinationId_fkey";
ALTER TABLE IF EXISTS ONLY public."Plan" DROP CONSTRAINT IF EXISTS "Plan_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."PlanItem" DROP CONSTRAINT IF EXISTS "PlanItem_planId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_articleId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_pkey";
ALTER TABLE IF EXISTS ONLY public."Promotion" DROP CONSTRAINT IF EXISTS "Promotion_pkey";
ALTER TABLE IF EXISTS ONLY public."Plan" DROP CONSTRAINT IF EXISTS "Plan_pkey";
ALTER TABLE IF EXISTS ONLY public."PlanItem" DROP CONSTRAINT IF EXISTS "PlanItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Event" DROP CONSTRAINT IF EXISTS "Event_pkey";
ALTER TABLE IF EXISTS ONLY public."Destination" DROP CONSTRAINT IF EXISTS "Destination_pkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_pkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Review";
DROP TABLE IF EXISTS public."Promotion";
DROP TABLE IF EXISTS public."PlanItem";
DROP TABLE IF EXISTS public."Plan";
DROP TABLE IF EXISTS public."Event";
DROP TABLE IF EXISTS public."Destination";
DROP TABLE IF EXISTS public."Comment";
DROP TABLE IF EXISTS public."Article";
DROP TYPE IF EXISTS public."Role";
--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
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
    "updatedAt" timestamp(3) without time zone NOT NULL
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
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL
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

COPY public."Article" (id, title, content, image, category, author, date, "createdAt", "updatedAt") FROM stdin;
cmlaw6yol0002fqd4dfhbmvea	Wisata Kuliner: Menjelajahi Kelezatan Sate Padang di Malam Hari	Sate Padang adalah primadona kuliner malam hari. Temukan rekomendasi sate padang paling legendaris di pusat kota Padang.	https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800	Kuliner	Admin	2026-02-06 12:59:33.525	2026-02-06 12:59:33.525	2026-02-06 12:59:33.525
cmlaw6yoj0001fqd4102pomgv	5 Spot Sunset Terbaik di Padang yang Wajib Dikunjungi	Padang terkenal dengan sunsetnya yang memukau. Berikut adalah 5 spot terbaik mulai dari Pantai Air Manis hingga Gunung Padang.	data:image/jpeg;base64,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	Tips	Admin	2026-02-06 12:59:33.523	2026-02-06 12:59:33.523	2026-02-06 13:47:55.884
cmlaw6yod0000fqd4uejaaqnb	Festival Siti Nurbaya 2026: Kemeriahan Budaya di Tepi Pantai	Festival Siti Nurbaya kembali hadir di tahun 2026 dengan rangkaian acara yang lebih megah. Mulai dari lomba selaju sampan hingga pawai budaya Minangkabau.	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWX9mrIpy8AhlqixCFosYi6yQMHz6ZAjG7oQ&s	Budaya	Admin	2026-02-06 12:59:33.517	2026-02-06 12:59:33.517	2026-02-06 13:56:28.223
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (id, content, "articleId", "userId", "createdAt") FROM stdin;
cmlb19yqv0001on6aplkyumch	ok	cmlaw6yod0000fqd4uejaaqnb	cml3u71g10003mns1xxlit0f6	2026-02-06 15:21:51.655
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
cml3u712f0002mns1im8cs3w3	Road To Gastronomy City	Special Event	https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop	Dinas Pariwisata	2026-02-01 14:29:14.151	https://www.youtube.com/watch?v=hBCOnW7TDZI
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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, level, points, avatar, "createdAt", email, password, phone, "updatedAt", role) FROM stdin;
cml3uu1zx00005yx8g084irsj	ARI	1	0	\N	2026-02-01 14:47:08.445	ari@gmail.com	$2b$10$2meoDVQFo1KYmRw2rThcUuiHi.sdgH/BFIEz3c9Pi94wmRXqVDHLa	\N	2026-02-01 14:47:08.445	USER
cml3v6oqb00015yx82wzgqmwn	romy	1	0	\N	2026-02-01 14:56:57.779	romy@tic.com	$2b$10$lQa9.iB.KlXaoTWrZRDEYOEgCSsViFENh7.7kn2XcQT9B2OLhTZMq	\N	2026-02-01 14:56:57.779	USER
cml537g5v000021rtf5eopb8a	Test User	1	0	\N	2026-02-02 11:29:16.413	test@test.com	$2b$10$Ow1Nyb4GGw5oFuAhJZqYsOQoH/kYLJZez4R88.7q.o9GEeWB1IQIS	\N	2026-02-02 11:29:16.413	USER
cml3u71g10003mns1xxlit0f6	Super Admin TIC	1	0	https://api.dicebear.com/7.x/avataaars/svg?seed=Admin	2026-02-01 14:29:14.642	admin@tic.com	$2b$10$NNBzxxe4R5fA7NYLuvP5n.4sgG8TA0oxhoQJs503ORXgFmINz1plC	\N	2026-02-01 14:29:14.642	ADMIN
cml8u41eu000ccqhvfcv4l10m	atsil	1	0	\N	2026-02-05 02:25:45.51	atsil@gmail.com	$2b$10$IupXULkmW3C4z3vwtKrDzuAWg9QRCPGg.Vr8cREDKtvLNFh.2HyFu	\N	2026-02-05 02:25:45.51	USER
cmla57k81000xcqhvzxxeo370	Fajri	1	0	\N	2026-02-06 00:24:11.81	muhammadfajriharahap@gmail.com	$2b$10$LZEy6YmECA4uiLQGZ1TU2OiFPdZfLV2y56lKgpPkSeA.5zROW/K2u	\N	2026-02-06 00:24:11.81	USER
cmlamhkp60015cqhvsmaxrfuc	Rika Novita Sari 	1	0	\N	2026-02-06 08:27:52.458	rikanovitasari31@gmail.com	$2b$10$k1nF1EgX8IwLmUNEMcFirONkVPREIy9rb8PAPVZGayJFI/4C/A7zW	\N	2026-02-06 08:27:52.458	USER
cmlan5892001tcqhvlpt99xkv	Siti Gloria	1	0	\N	2026-02-06 08:46:16.07	sitigloria29@gmail.com	$2b$10$5q1xNMyQvna09fk.yptVU.pVmq7gvPKlAmubsO068oDG7fHKzFE26	\N	2026-02-06 08:46:16.07	USER
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
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


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
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


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
-- PostgreSQL database dump complete
--

\unrestrict 3EN58nNXqdHNGvc97vCx3edoF7e1iC71fe7h9LCPF4bOMTxDWdmRawS1I5ahXpR

