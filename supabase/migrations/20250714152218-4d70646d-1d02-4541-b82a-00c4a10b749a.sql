-- Clean up all placeholder data from the database

-- Delete from related tables first to maintain referential integrity
DELETE FROM user_interactions WHERE prompt_id IN (
  '250589fd-7cc2-4935-aa61-6d4dc4580f2b',
  'c90fac4d-f282-46a8-9e6b-3f75773a9077', 
  '5c86f9f4-c525-4bce-86dd-94ecaa81524a',
  'd5ab6edc-f5ba-4ff8-8175-ff47cb33f811',
  'e0e269fd-5e4f-4daa-86ee-9b89da4d2be7',
  '82c76dc7-7a77-4278-a220-92b2d07fcda5'
);

DELETE FROM ratings WHERE prompt_id IN (
  '250589fd-7cc2-4935-aa61-6d4dc4580f2b',
  'c90fac4d-f282-46a8-9e6b-3f75773a9077',
  '5c86f9f4-c525-4bce-86dd-94ecaa81524a', 
  'd5ab6edc-f5ba-4ff8-8175-ff47cb33f811',
  'e0e269fd-5e4f-4daa-86ee-9b89da4d2be7',
  '82c76dc7-7a77-4278-a220-92b2d07fcda5'
);

DELETE FROM comments WHERE prompt_id IN (
  '250589fd-7cc2-4935-aa61-6d4dc4580f2b',
  'c90fac4d-f282-46a8-9e6b-3f75773a9077',
  '5c86f9f4-c525-4bce-86dd-94ecaa81524a',
  'd5ab6edc-f5ba-4ff8-8175-ff47cb33f811', 
  'e0e269fd-5e4f-4daa-86ee-9b89da4d2be7',
  '82c76dc7-7a77-4278-a220-92b2d07fcda5'
);

DELETE FROM prompt_tags WHERE prompt_id IN (
  '250589fd-7cc2-4935-aa61-6d4dc4580f2b',
  'c90fac4d-f282-46a8-9e6b-3f75773a9077',
  '5c86f9f4-c525-4bce-86dd-94ecaa81524a',
  'd5ab6edc-f5ba-4ff8-8175-ff47cb33f811',
  'e0e269fd-5e4f-4daa-86ee-9b89da4d2be7', 
  '82c76dc7-7a77-4278-a220-92b2d07fcda5'
);

-- Finally delete the placeholder prompts
DELETE FROM prompts WHERE id IN (
  '250589fd-7cc2-4935-aa61-6d4dc4580f2b',
  'c90fac4d-f282-46a8-9e6b-3f75773a9077',
  '5c86f9f4-c525-4bce-86dd-94ecaa81524a',
  'd5ab6edc-f5ba-4ff8-8175-ff47cb33f811',
  'e0e269fd-5e4f-4daa-86ee-9b89da4d2be7',
  '82c76dc7-7a77-4278-a220-92b2d07fcda5'
);