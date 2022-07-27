---- Получить список всех категорий

SELECT * FROM categories;

---- Получить список категорий, для которых создано минимум одно объявление

SELECT
  id, name
FROM categories
JOIN offers_categories
  ON id = category_id
GROUP BY id;

---- Получить список категорий с количеством объявлений

SELECT id, name, COUNT(category_id)
FROM categories
LEFT JOIN offers_categories
  ON id = category_id
GROUP BY id;

---- Получить список объявлений (Сначала свежие объявления)

SELECT
  offers.id, title, sum, type, left(offers.description, 1) AS "Описание",
  name,
  concat(lastname, ' ', firstname) AS "Автор",
  COUNT(comments.id) AS "Кол-во комментариев"
FROM offers
JOIN offers_categories
  ON offers.id = offers_categories.offer_id
JOIN categories
  ON categories.id = offers_categories.category_id
JOIN users
  ON offers.user_id = users.id
LEFT JOIN comments
  ON comments.offer_id = offers.id
GROUP BY offers.id, name, lastname, firstname
ORDER BY offers.created_at DESC;

---- Получить полную информацию определённого объявления

SELECT
  offers.id, offers.title, offers.sum, offers.type,
  left(offers.description, 1) AS "Описание", offers.created_at,
  concat(users.firstname,' ',users.lastname) as "Пользователь",
  users.email, count(comments.id) AS "Кол-во комментариев",
  ct.name AS "Категории"
FROM offers_categories as oft
JOIN offers
  ON oft.offer_id = offers.id
JOIN categories as ct
  ON oft.category_id = ct.id
JOIN users
  ON offers.user_id = users.id
LEFT JOIN comments
  ON comments.offer_id = offers.id
WHERE
  offers.id = 1
GROUP BY
  offers.id, users.firstname, users.lastname, users.email, ct.name;

---- Получить список из 5 свежих комментариев

SELECT
  comments.id,
  comments.offer_id,
  concat(users.firstname,' ',users.lastname) as "Пользователь",
  comments.comment
FROM comments
JOIN users
  ON comments.user_id = users.id
ORDER BY
  comments.created_at DESC
LIMIT 5;

---- Получить список комментариев для определённого объявления (Сначала новые комментарии)

SELECT
  comments.id,
  comments.offer_id,
  concat(users.firstname,' ',users.lastname) as "Пользователь",
  comments.comment
FROM comments
JOIN users
  ON comments.user_id = users.id
WHERE
  comments.offer_id = 2
ORDER BY
  comments.created_at DESC;

---- Выбрать 2 объявления, соответствующих типу offer;

SELECT * FROM offers
WHERE
  offers.type = 'offer'
LIMIT 2;

---- Обновить заголовок определённого объявления на «Уникальное предложение!»;

UPDATE offers
  SET title = 'Уникальное предложение!'
WHERE offers.id = 1;
