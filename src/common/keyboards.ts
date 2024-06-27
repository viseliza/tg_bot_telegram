export const keyboard_owner = [{
    command: 'book',
    description: 'Запись на доступные слоты, полученные из Google Calendar.',
}, {
    command: 'chat',
    description: 'Начать общение с ChatGPT',
}];

export const keyboard_user = [{
    command: 'schedule',
    description: 'Отображение текущих событий из Google Calendar',
}, {
    command: 'events',
    description: 'Менеджер событий из Google Calendar.',
}, {
    command: 'set_availability',
    description: 'Указание временных слотов, когда можно назначать встречи.',
}, {
    command: 'ask',
    description: 'Отправить запрос ChatGPT и получить его ответ.',
}, {
    command: 'generate',
    description: 'Отправить запрос DALL-E и получить его ответ.',
}];

export const inline_keyboard_user = [
    ['Записаться 🗓', 'Чат 💬']
]

export const inline_keyboard_owner = [
    ['Расписание 🗓', 'События 📌'],
    ['Свободное время 🕓'],
    ['Вопрос ❔', 'Сгенерировать 🖼']
]