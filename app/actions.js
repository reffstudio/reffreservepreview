'use server'

import { supabase } from '@/lib/supabase'

export async function registerLead(formData) {
  const email = formData.get('email')?.toString().trim()
  const name = formData.get('name')?.toString().trim()
  const city = formData.get('city')?.toString().trim()

  if (!email || !name || !city) {
    return { success: false, message: 'Please complete all fields.' }
  }

  const { error } = await supabase.from('leads').insert({
    email,
    project_slug: 'reff-reserve',
    metadata: { name, city },
  })

  if (error) {
    if (error.code === '23505') {
      return {
        success: true,
        message: 'YOU ARE ALREADY ON THE PRIVATE LIST.',
      }
    }

    console.error('Supabase lead registration error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }

  return {
    success: true,
    message: 'You are on the list.',
  }
}
