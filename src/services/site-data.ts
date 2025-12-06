import { supabase } from '@/lib/supabase/client'
import { CMSData } from '@/types/content'

export const SITE_DATA_SECTION_NAME = 'landing_page'

/**
 * Saves site data to the database.
 * If the entry exists, it updates it. If not, it creates a new one.
 */
export const saveSiteData = async (sectionName: string, content: CMSData) => {
  // Upsert operation
  const { data, error } = await supabase
    .from('site_data')
    .upsert(
      {
        section_name: sectionName,
        content: content as unknown as any, // Casting to any because Supabase types expect Json but we pass typed object
      },
      { onConflict: 'section_name' },
    )
    .select()

  if (error) {
    console.error('Error saving site data:', error)
    throw new Error('Falha ao salvar dados do site.')
  }

  return data
}

/**
 * Loads site data from the database.
 * Returns the content object or null if not found.
 */
export const loadSiteData = async (
  sectionName: string,
): Promise<CMSData | null> => {
  const { data, error } = await supabase
    .from('site_data')
    .select('content')
    .eq('section_name', sectionName)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Error code for no rows returned
      return null
    }
    console.error('Error loading site data:', error)
    throw new Error('Falha ao carregar dados do site.')
  }

  return data.content as unknown as CMSData
}
