// scripts/link-images.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'project-images';
const STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/`;

async function linkImages() {
  console.log('Fetching projects...');

  // 1. Get all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, slug');

  if (projectsError) {
    console.error('Error fetching projects:', projectsError.message);
    return;
  }

  console.log(`Found ${projects.length} projects`);

  // 2. List all files in the bucket
  console.log(`Listing files in bucket '${BUCKET_NAME}'...`);
  const { data: files, error: filesError } = await supabase
    .storage
    .from(BUCKET_NAME)
    .list('');

  if (filesError) {
    console.error('Error listing files:', filesError.message);
    return;
  }

  console.log(`Found ${files.length} images in bucket`);

  // 3. Group files by slug (extract prefix)
  const imageMap = {};
  files.forEach(file => {
    // Remove extension and trailing numbers (e.g., "VC(TC)_nb_01.jpg" → "VC(TC)_nb")
    // We want to match the project slug exactly
    let base = file.name.replace(/\.[^.]+$/, ''); // remove extension
    base = base.replace(/_[0-9]+$/, ''); // remove trailing _01, _02, etc.
    // The base should now match the project slug (with parentheses and underscores)
    if (!imageMap[base]) imageMap[base] = [];
    imageMap[base].push(file.name);
  });

  // 4. For each project, find matching images and insert them
  for (const project of projects) {
    const slug = project.slug;
    const imageFiles = imageMap[slug] || [];

    if (imageFiles.length === 0) {
      console.log(`No images found for project: ${slug}`);
      continue;
    }

    console.log(`Linking ${imageFiles.length} images to ${slug} (ID: ${project.id})`);

    // Sort filenames to maintain order (optional)
    imageFiles.sort();

    // Insert each image into project_images
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const imageUrl = `${STORAGE_URL}${encodeURIComponent(filename)}`; // handle special chars

      const { error } = await supabase
        .from('project_images')
        .insert({
          project_id: project.id,
          image_url: imageUrl,
          image_type: 'gallery',
          sort_order: i + 1,
        });

      if (error) {
        console.error(`Failed to insert ${filename}:`, error.message);
      } else {
        console.log(`Inserted: ${filename}`);
      }
    }

    // 5. Update the main image_url in projects table (use the first image)
    const mainImageUrl = `${STORAGE_URL}${encodeURIComponent(imageFiles[0])}`;
    const { error: updateError } = await supabase
      .from('projects')
      .update({ image_url: mainImageUrl })
      .eq('id', project.id);

    if (updateError) {
      console.error(`Failed to update image_url for ${slug}:`, updateError.message);
    } else {
      console.log(`Updated main image for ${slug}`);
    }
  }

  console.log('All done!');
}

linkImages().catch(console.error);