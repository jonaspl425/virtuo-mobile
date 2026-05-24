insert into public.banned_words (word)
values ('admin'), ('moderator'), ('support')
on conflict do nothing;

insert into public.islands (id, title, description, order_index)
values
  ('00000000-0000-0000-0000-000000000101', 'Foundation Island', 'Warm up your voice, reduce filler words, and learn crisp answers.', 1),
  ('00000000-0000-0000-0000-000000000102', 'Story Harbor', 'Shape short stories with openings, turns, and memorable endings.', 2),
  ('00000000-0000-0000-0000-000000000103', 'Pressure Peak', 'Handle improvised prompts and checkpoint challenges under time.', 3)
on conflict do nothing;

insert into public.exercises (
  id,
  island_id,
  title,
  description,
  instructions,
  exercise_type,
  skill_targets,
  order_index,
  is_checkpoint,
  checkpoint_pass_threshold,
  duration_target_seconds
)
values
  (
    '00000000-0000-0000-0000-000000001001',
    '00000000-0000-0000-0000-000000000101',
    'Clear Introduction',
    'Introduce a familiar topic with one clean opening sentence.',
    'Speak for at least 20 seconds. Avoid filler words and answer the generated topic directly.',
    'speech',
    array['clarity', 'confidence'],
    0,
    false,
    0.7,
    20
  ),
  (
    '00000000-0000-0000-0000-000000001002',
    '00000000-0000-0000-0000-000000000101',
    'Balderdash',
    'Explain a fictional word as if it belongs in a real dictionary.',
    'Give a 30 second explanation of the generated fictional word. Define it, use it, and keep a straight structure.',
    'balderdash',
    array['vocabulary', 'confidence'],
    1,
    false,
    0.7,
    30
  ),
  (
    '00000000-0000-0000-0000-000000001003',
    '00000000-0000-0000-0000-000000000101',
    'Foundation Checkpoint',
    'A mixed challenge combining definition, structure, and clarity.',
    'Complete the generated speaking challenge and score at least 70 percent to pass.',
    'checkpoint',
    array['clarity', 'structure', 'pacing'],
    2,
    true,
    0.7,
    45
  )
on conflict do nothing;
