
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding culinary spots...')

    const spots = [
        {
            name: 'Pagi Sore',
            category: 'Restoran',
            description: 'Restoran Masakan Padang legendaris yang terkenal dengan ayam pop dan rendangnya. Tempatnya nyaman dan pelayanan cepat.',
            priceRange: 'Rp 25.000 - Rp 28.000',
            address: 'Jl. Pondok No. 143, Padang',
            lat: -0.957,
            lng: 100.354,
            image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&auto=format&fit=crop', // Placeholder
            facilities: ['AC', 'WiFi', 'Musholla', 'Parking', 'Toilet'],
            openingHours: {
                "Senin": "08:00 - 22:00",
                "Selasa": "08:00 - 22:00",
                "Rabu": "08:00 - 22:00",
                "Kamis": "08:00 - 22:00",
                "Jumat": "08:00 - 22:00",
                "Sabtu": "08:00 - 23:00",
                "Minggu": "08:00 - 23:00"
            },
            menuHighlights: [
                { name: "Ayam Pop", price: 25000, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200" },
                { name: "Rendang Dagin", price: 28000, image: "https://images.unsplash.com/photo-1594916698944-933333333333?w=200" } // Placeholder
            ],
            rating: 4.8,
            totalReviews: 120,
        },
        {
            name: 'Sate Mak Syukur',
            category: 'Warung',
            description: 'Sate Padang khas Padang Panjang dengan kuah kuning kental yang gurih. Dagingnya empuk dan bumbunya meresap.',
            priceRange: 'Rp 12.000 - Rp 35.000',
            address: 'Jl. Sutan Syahrir No. 250, Padang Panjang',
            lat: -0.470,
            lng: 100.410,
            image: 'https://images.unsplash.com/photo-1529566652340-2c41a1eb6d93?w=600&auto=format&fit=crop', // Placeholder Sate
            facilities: ['Parking', 'Toilet'],
            openingHours: {
                "Senin": "09:00 - 21:00",
                "Selasa": "09:00 - 21:00",
                "Rabu": "09:00 - 21:00",
                "Kamis": "09:00 - 21:00",
                "Jumat": "09:00 - 21:00",
                "Sabtu": "09:00 - 22:00",
                "Minggu": "09:00 - 22:00"
            },
            menuHighlights: [
                { name: "Sate Padang Full Daging", price: 35000, image: "" },
                { name: "Teh Talua", price: 12000, image: "" }
            ],
            rating: 4.7,
            totalReviews: 350,
        },
        {
            name: 'Kopilau',
            category: 'Cafe',
            description: 'Coffee shop hits di tepi pantai dengan pemandangan sunset yang indah. Cocok untuk nongkrong sore hari.',
            priceRange: 'Rp 20.000 - Rp 32.000',
            address: 'Jl. Samudera, Padang',
            lat: -0.965,
            lng: 100.350,
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop', // Placeholder Cafe
            facilities: ['WiFi', 'Outdoor Seating', 'Live Music', 'Parking'],
            openingHours: {
                "Senin": "16:00 - 23:00",
                "Selasa": "16:00 - 23:00",
                "Rabu": "16:00 - 23:00",
                "Kamis": "16:00 - 23:00",
                "Jumat": "16:00 - 24:00",
                "Sabtu": "16:00 - 24:00",
                "Minggu": "16:00 - 23:00"
            },
            menuHighlights: [
                { name: "Iced Caramel Macchiato", price: 32000, image: "" },
                { name: "Pisang Bakar Keju", price: 20000, image: "" }
            ],
            rating: 4.5,
            totalReviews: 85,
        },
        {
            name: 'Es Durian Ganti Nan Lamo',
            category: 'Dessert',
            description: 'Kedai es durian legendaris yang sudah ada sejak puluhan tahun lalu. Wajib coba bagi pecinta durian.',
            priceRange: 'Rp 28.000',
            address: 'Jl. Pulau Karam No. 103B, Padang',
            lat: -0.958,
            lng: 100.356,
            image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop', // Placeholder Dessert
            facilities: ['AC', 'Toilet'],
            openingHours: {
                "Everyday": "10:00 - 22:00"
            },
            menuHighlights: [
                { name: "Es Durian Spesial", price: 28000, image: "" }
            ],
            rating: 4.6,
            totalReviews: 200
        },
        {
            name: 'Soto Garuda',
            category: 'Restoran',
            description: 'Soto Padang otentik dengan irisan daging dendeng kering yang renyah dan kuah kaldu yang kaya rempah.',
            priceRange: 'Rp 5.000 - Rp 30.000',
            address: 'Jl. S. Parman No. 110, Padang',
            lat: -0.930,
            lng: 100.365,
            image: 'https://images.unsplash.com/photo-1572656303121-e35a1f9e77f9?w=600&auto=format&fit=crop', // Placeholder Soto
            facilities: ['AC', 'Parking', 'Toilet', 'Musholla'],
            openingHours: {
                "Everyday": "07:00 - 21:00"
            },
            menuHighlights: [
                { name: "Soto Padang Daging", price: 30000, image: "" },
                { name: "Perkedel Kentang", price: 5000, image: "" }
            ],
            rating: 4.7,
            totalReviews: 150,
        }
    ]

    for (const spot of spots) {
        await prisma.culinarySpot.create({
            data: spot
        })
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
