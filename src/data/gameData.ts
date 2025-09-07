const randomOptions = {
    house: [
        ['Mansion', 'Apartment', 'Shack', 'House'],
        ['Castle', 'Penthouse', 'Cabin', 'Tiny House'],
        ['Villa', 'Cottage', 'Loft', 'Treehouse'],
        ['Palace', 'Studio', 'Farmhouse', 'Igloo with Central Heating']
    ],
    spouse: [
        ['Brad Pitt', 'Emma Stone', 'Ryan Gosling', 'The Borg Queen'],
        ['Leonardo DiCaprio', 'Scarlett Johansson', 'Michael B. Jordan', 'A Very Attractive Cactus'],
        ['Chris Hemsworth', 'Zendaya', 'Henry Cavill', 'The Lamb From Silence of the Lambs'],
        ['Ryan Reynolds', 'Taylor Swift', 'Chris Evans', 'Darth Vader']
    ],
    job: [
        ['Astronaut', 'Chef', 'Pilot', 'Professional Netflix Watcher'],
        ['Lawyer', 'Artist', 'Musician', 'Unicorn Trainer'],
        ['Scientist', 'Writer', 'Designer', 'Professional Couch Tester'],
        ['Doctor', 'Teacher', 'Engineer', 'Professional Bubble Wrapper']
    ],
    children: [
        ['0', '1', '3', '42'],
        ['2', '3', '4', '32'],
        ['5', '6', '7', '69'],
        ['0', '2', '5', '867']
    ],
    car: [
        ['Ferrari', 'Lamborghini', 'Porsche', 'Skateboard with XL Cup Holders'],
        ['Mercedes', 'Audi', 'Jaguar', 'Giant Hamster Wheel'],
        ['Range Rover', 'Bentley', 'Maserati', 'Reliant Regal Supervan III'],
        ['Tesla', 'Toyota', 'BMW', 'Shopping Trolley with Speed Stripes']
    ],
    location: [
        ['Malibu', 'Monaco', 'Switzerland', 'Cardboard box (now with holes!)'],
        ['Hawaii', 'Italy', 'Greece', 'Secret Base Inside a Volcano'],
        ['Australia', 'Iceland', 'Norway', 'Floating Castle in the Clouds'],
        ['Paris', 'Tokyo', 'New York', 'Underground Bunker (with WiFi)']
    ],
    salary: [
        ['£75k', '£150k', '£5M', '5% Discount at Sneed\'s Feed & Seed'],
        ['£60k', '£200k', '£10M', 'Pizza'],
        ['£90k', '£250k', '£50M', 'Three Beans and a Promise'],
        ['£50k', '£100k', '£1M', '£3.50 and a High Five']
    ]
}

const categoryTitles = {
    house: 'Home',
    spouse: 'Spouse',
    children: 'Children',
    job: 'Job',
    car: 'Car',
    location: 'Location',
    salary: 'Salary'
}

export const getDefaultCategories = () => {
    const categories: Record<string, { title: string; options: string[] }> = {}

    Object.keys(randomOptions).forEach(categoryKey => {
        const options = randomOptions[categoryKey as keyof typeof randomOptions]
        const randomIndex = Math.floor(Math.random() * options.length)

        categories[categoryKey] = {
            title: categoryTitles[categoryKey as keyof typeof categoryTitles],
            options: options[randomIndex]
        }
    })

    return categories
}

export const getRandomOptions = (category: string): string[] => {
    const options = randomOptions[category as keyof typeof randomOptions]
    if (options) {
        return options[Math.floor(Math.random() * options.length)]
    }

    // Fallback to default if category not found
    return getDefaultCategories()[category]?.options || []
}
