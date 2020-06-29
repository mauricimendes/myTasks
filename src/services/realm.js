import Realm from 'realm'

import TasksSchema from '../schemas/TasksSchema'

export default function getRealm() {
    return Realm.open({
        schema: [TasksSchema],
    })
}