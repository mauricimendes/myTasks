export default class TaskSchema {
    static schema = {
        name: 'Tasks',
        primaryKey: 'id',
        properties: {
            id: { type: 'string', indexed: true },
            name: 'string',
            description: 'string',
            day: 'string',
            hour: 'string',
            do: 'string'
        }
    }
}