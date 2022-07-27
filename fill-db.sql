---- Данные для категорий

INSERT INTO categories VALUES
  (DEFAULT, 'Книги'),
  (DEFAULT, 'Разное'),
  (DEFAULT, 'Посуда'),
  (DEFAULT, 'Игры'),
  (DEFAULT, 'Животные'),
  (DEFAULT, 'Журналы');

---- Данные для ролей

INSERT INTO roles VALUES
  (DEFAULT, 'user'),
  (DEFAULT, 'author'),
  (DEFAULT, 'admin');

---- Данные для пользователей

INSERT INTO users VALUES
  (DEFAULT, 'Артем', 'Рябков', 'gold_100@bk.ru', '123456', NULL),
  (DEFAULT, 'Валентина', 'Рябкова', 'valyamsk@yandex.ru', '123456', NULL),
  (DEFAULT, 'Михаил', 'Николаев', 'mishagame@info.com', '123456', NULL);

---- Данные для объявлений

INSERT INTO offers VALUES
  (DEFAULT, 'Ботинки', 'sale', '2500', 'Красные модные ботинки', '2022-04-30', 'img1', 1),
  (DEFAULT, 'Платье', 'sale', '2500', 'Черное как ночь', '2022-03-30', 'img2', 2),
  (DEFAULT, 'Видеокарта', 'buy', '22500', 'целую, без майнинга', '2022-04-15', 'img3', 1),
  (DEFAULT, 'Автомобиль', 'sale', '2500', 'не бит не крашен', '2022-02-03', 'img4', 3),
  (DEFAULT, 'Гордость', 'sale', '2500', 'Продаю за ненадобностью', '2022-01-01', 'img5', 1);

---- Данные для комментариев

INSERT INTO comments VALUES
  (DEFAULT, 'Видеокарта не работает!Продавец жулик!','2022-04-15', 1, 3),
  (DEFAULT, 'Отличное платье! я в восторге','2022-03-31', 2, 2),
  (DEFAULT, 'Да-да! Жуулииик!','2022-04-15', 3, 3);

---- Связь объявлений-категорий

INSERT INTO offers_categories VALUES
  (1, 1),
  (2, 5),
  (3, 4),
  (5, 2),
  (4, 3);

---- Связь пользователей-ролей

INSERT INTO users_roles VALUES
  (1, 3),
  (2, 1),
  (3, 1);
