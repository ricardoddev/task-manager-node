import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description }= req.body

            if (!title || typeof title !== 'string' || !description || typeof description !== 'string') {
                return res.writeHead(400).end('Campos title e description são obrigatórios e devem ser strings.');
            }

            const task = {
                id: randomUUID(),
                title: title,
                description,
                completed_at: null,
                created_at: new Date().toLocaleString('pt-br'),
                updated_at: new Date().toLocaleString('pt-br'),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end(JSON.stringify(task))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const { title, description } = req.body

            const currentTask = database.get('tasks', id)

            database.update('tasks', id, {
                ...currentTask,
                title: title ? title : currentTask.title,
                description: description ? description : currentTask.description,
                updated_at: new Date().toLocaleString('pt-br')
            })

            return res.writeHead(204).end('Task alterada.')
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const currentTask = database.get('tasks', id)

            database.update('tasks', id, {
                ...currentTask,
                completed_at: new Date().toLocaleString('pt-br')
            })

            return res.writeHead(204).end('Task completada.')
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
]