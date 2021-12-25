# **Техническое задание**

## **О проекте**

Данное приложение — сервис для формирования коллекции фильмов для просмотра. Пользователям предоставляется возможность добавлять в избранное фильмы, а так же сортировать их и искать.

## **Описание функциональности**

При открытии страницы загружаются фильмы и отображаются в виде карточек фильма.

## **Сортировка**

Все сортировки работаю по убыванию. 

Сортировка возможна по следующим категориям:

- рейтингу
- дата выпуска
- сумма кассового сбора

## **Добавление фильма в избранное**

Фильм можно добавить в избранное при помощи кнопки "+" в карточке. Добавленная карточка исчезает из списка фильмов. Добавленные фильмы в избранное хранятся в localStorage.

## **Удаление фильма из избранного**

Фильм можно удалить из избранного при помощи кнопки "х" в карточке. Добавленная карточка исчезает из списка фильмов.

## **Переключение в режим избранных фильмов**

При переключении в режим избранных фильмов, поиск очищается. Фильтр сбрасывается. Отображаются только избранные фильмы.

## **Поиск по фильмам**

Поиск осуществляется по названию фильма, любое слово из фильма должно учитываться в поиске. При выполнения поиска сбрасывается выбранный фильтр (порядок фильмов должен быть такой как пришел с сервера).

## **Карточка фильма**

Карточка фильма состоит из постера и его описания. Все данные придут с сервера. 

Максимальное количество символов для Сюжета 140. Если Сюжет содержит более 140 символов то должно отобразится 137 и '...'.

С сервера могут прийти значения с **null**. В таком случае необходимо установить значения по умолчанию. 

- Рейтинг, Бюджет установть **0**
- Дата релиза, Режисер, Сюжет установить **прочерк(-)**

# API

Адресс (URL): [https://fe08-films.herokuapp.com/](https://fe08-films.herokuapp.com/)

1. Что бы получать данные вам необходимо авторизоваться. Для этого необходимо отправить POST запрос на русурс “/auth". В ответ вам будет возвращен токен.
2. Для получения фильмов необходимо использовать ресурс “/films”. Этот ресурс требует наличие токена в запросе. По этому вам необходимо добавить в заголовок “Autorization: Beare (токен из пункта 1)”

# **План выполнения задания*(рекомендация)***

## **Замокать данные**

Создать массив и написать функцию для генерации объектов, которые описывают фильм.

Пример структуры карточки фильма может быть такой:

```jsx
{
   title: 'Jurassic World: Fallen Kingdom',
   releseDate: '06-06-2018',
   plot: 'When the island s dormant volcano begins roaring to life, Owen and Claire mount a campaign to rescue the remaining dinosaurs from this extinction-level event.',
   poster: 'https://m.media-amazon.com/images/M/MV5BNzIxMjYwNDEwN15BMl5BanBnXkFtZTgwMzk5MDI3NTM@._V1_SX300.jpg',
   boxOffice: '$417,719,760',
   rating: 6.3,
   director: 'J.A. Bayona',
}
```

## **Отобразить замоканные данные.**

создать функцию которая будет отрисовывать, замоканные данные на странице.

## Реализовать функционал сортировки

На этом этапе данные уже будут отрисованы на странице. Вам необходимо продумать модуль который смоежт менять их порядок сошласна фильтра и заново отрисовывать.

## Реализовать функционал сохранения в избранное

Продумать механизм добовления\удаление в категорию избранное.

## Реализовать функциональность поиска

тут учитывайте что после удаления запроса приложение должно вернуться в исходное положение, согласно выбранного фильма.

## Реализовать сохранения состояние приложения в localStorage

тут нужно продумать подход сохранения всего содержимого в localStorage, чтобы полсле перезаргрузки страницы я имел прежнее состояние.

## Замена генерируемых данных на данные из API

Добавить запрос к API для получения данных, удалить код который использовался для генерации данных.
