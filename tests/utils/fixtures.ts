export const mockUser = {
    _id: 1,
    username: 'username',
    password: 'password',
    email: 'email',
    favorites: [1, 2]
}

export const mockFilters = [
    {
        type: 'status',
        content: [
            {
                value: 'alive',
                label: 'Alive'
            },
            {
                value: 'dead',
                label: 'Dead'
            },
            {
                value: 'unknown',
                label: 'Unknown'
            }
        ]
    }
]

export const mockCharacters = {
    info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null
    },
    results: [{
        id: 1,
        name: 'name',
        status: 'status',
        species: 'species',
        type: 'type',
        gender: 'male',
        origin: {
            name: 'origin',
            url: 'url'
        },
        location: {
            name: 'location',
            url: 'url'
        },
        image: 'image',
        episode: [],
        url: 'url',
        created: 'created'
    }]
}
