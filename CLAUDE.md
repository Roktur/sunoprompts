# CLAUDE.md — SunoVault Project Context

## Что это за проект

**SunoVault** — личная база знаний промптов для генерации музыки в Suno AI.
Стек: React 19 + Vite 8 + Supabase (PostgreSQL) + CSS (без UI-фреймворков).

Запуск: `npm run dev` → http://localhost:5173

---

## Структура проекта

```
src/
  components/
    PromptCard.jsx          # Карточка промпта в гриде
    CardGrid.jsx            # Грид карточек с виртуальным скроллом
    Header.jsx              # Шапка с поиском и кнопками
    SearchBar.jsx           # Поисковая строка
    GenreBadge.jsx          # Бейдж жанра на карточке
    TagPill.jsx             # Пилюля тега
    TagInput.jsx            # Инпут для добавления тегов
    ComboBox.jsx            # Комбобокс (жанр, настроение)
    FilterDrawer.jsx        # Боковой фильтр-дровер
    ActiveFilterChips.jsx   # Активные фильтры-чипы
    LoginScreen.jsx         # Экран входа (Supabase Auth)
    modals/
      AddEditModal.jsx      # Модалка добавления/редактирования промпта
      ViewModal.jsx         # Модалка просмотра промпта
      ConfirmDelete.jsx     # Подтверждение удаления
      ModalOverlay.jsx      # Оверлей для модалок
  utils/
    gradients.js            # Градиенты жанров и пресеты обложек
    copyToClipboard.js      # Копирование промпта
  services/
    promptsService.js       # CRUD через Supabase (toRow/fromRow маппинг)
  hooks/
    useAuth.js              # Хук авторизации
    usePrompts.js           # Хук загрузки и управления промптами
    useModal.js             # Хук состояния модалок
    useSearch.js            # Хук поиска (Fuse.js)
  lib/
    supabase.js             # Клиент Supabase
  data/
    prompts.json            # Локальные тестовые данные (не используются в prod)
  index.css                 # Все стили (дизайн-токены + компоненты)
  App.jsx                   # Корневой компонент
  main.jsx                  # Точка входа
```

---

## База данных Supabase

Таблица `prompts`:

```sql
create table prompts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  prompt       text not null,
  tags         text[] default '{}',
  genre        text,
  mood         text,
  bpm          integer,
  is_favorite  boolean default false,
  image        text,          -- dataURL загруженного изображения
  cover_preset text,          -- id пресета обложки (см. gradients.js)
  created_at   timestamptz default now()
);
```

Миграция для `cover_preset` (добавлена в текущей сессии):
```sql
alter table prompts add column if not exists cover_preset text;
```

Маппинг camelCase ↔ snake_case находится в `promptsService.js` (функции `toRow` / `fromRow`).
**Важно:** при добавлении нового поля нужно обновлять обе функции + `updatePrompt`.

---

## Система обложек (coverPreset)

### Как работает

- У каждого промпта есть `image` (загруженное фото, dataURL) и `coverPreset` (id пресета).
- Приоритет отображения: `image` → `coverPreset` → градиент по жанру.
- Выбор пресета сбрасывает `image`, загрузка картинки сбрасывает `coverPreset`.

### Файл `src/utils/gradients.js`

Содержит три сущности:
1. `genreGradients` — градиенты по умолчанию для каждого жанра
2. `presetCovers` — массив пресетов обложек (20 штук: 15 базовых + 5 тестовых)
3. Хелперы: `getGradient(genre)`, `getPreset(id)`, `getPresetGradient(id)`

### Структура пресета

```js
{
  id: 'sunset',          // уникальный id, сохраняется в БД
  name: 'Sunset',        // отображается в tooltip
  gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
  label: 'Тестовый',    // опционально — текст поверх обложки на карточке
}
```

### 15 базовых пресетов

| id | Название | Цвета |
|---|---|---|
| sunset | Sunset | оранжевый → розовый |
| ocean | Ocean | небесно-синий → голубой |
| aurora | Aurora | изумрудный → индиго |
| midnight | Midnight | тёмно-индиго → фиолетовый |
| lava | Lava | красный → оранжевый |
| galaxy | Galaxy | индиго → пурпурный |
| mint | Mint | мятный → голубой |
| rose | Rose | розовый → фуксия |
| gold | Gold | янтарный → оранжевый |
| arctic | Arctic | светло-голубой → лавандовый |
| forest | Forest | тёмно-зелёный |
| neon | Neon | голубой → фиолетовый |
| coral | Coral | оранжевый → розовый |
| storm | Storm | серый → индиго |
| lavender | Lavender | лавандовый → светло-розовый |

### 5 тестовых пресетов с надписью

| id | Цвета | Надпись |
|---|---|---|
| test-crimson | тёмно-красный | Тестовый |
| test-teal | тёмно-зелёный | Тестовый |
| test-indigo | тёмно-фиолетовый | Тестовый |
| test-amber | тёмно-янтарный | Тестовый |
| test-slate | тёмно-серый | Тестовый |

---

## Что было сделано в текущей сессии

1. **Запустили приложение** — `npm run dev`

2. **Добавили 15 базовых цветовых обложек** (`presetCovers` в `gradients.js`)
   - UI пикер в `AddEditModal` под зоной загрузки (цветные кнопки-свотчи 38×38px)
   - Отображение на карточках (`PromptCard`) и в модалке просмотра (`ViewModal`)
   - CSS классы: `.cover-presets`, `.cover-presets__grid`, `.cover-preset`, `.cover-preset--active`

3. **Исправили баг**: после перезагрузки пресет не сохранялся
   - Причина: `coverPreset` не был включён в `toRow` / `fromRow` / `updatePrompt`
   - Добавлена колонка `cover_preset text` в Supabase
   - Исправлен маппинг в `promptsService.js`

4. **Добавили 5 пресетов с текстом по центру**
   - Поле `label` в объекте пресета
   - CSS `.card__cover-label` — белый текст с тенью по центру обложки
   - Пресеты с label в пикере отображаются шире (`.cover-preset--labeled`)
   - Добавлен хелпер `getPreset(id)` для получения полного объекта пресета

---

## Важные детали

- **Стили** — всё в одном файле `src/index.css`, дизайн-токены через CSS custom properties (`:root`)
- **Шрифты** — Syne (заголовки/UI) + JetBrains Mono (текст промптов)
- **Градиент по умолчанию** — если нет ни `image`, ни `coverPreset`, берётся `genreGradients[genre]`
- **dataURL в image** — картинки хранятся прямо в БД как base64 строки (может быть тяжело для больших изображений)
- **RLS в Supabase** — настроена политика `Public full access` для анонимного доступа (личное приложение)
