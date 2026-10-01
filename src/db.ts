import { supabase } from './supabase';
import { LookEntry } from './types';

export async function getAllEntries(email: string): Promise<LookEntry[]> {
  try {
    const { data, error } = await supabase
      .from('looks')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Ошибка загрузки:', error);
      return [];
    }
    
    return (data || []).map((row: any) => ({
      id: row.id,
      photo: row.photo,
      category: row.category,
      brand: row.brand || '',
      season: row.season || '',
      showName: row.show_name || '',
      notes: row.notes || '',
      tags: row.tags || [],
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Критическая ошибка:', err);
    return [];
  }
}

export async function addEntry(entry: Omit<LookEntry, 'id'>, email: string): Promise<LookEntry> {
  try {
    const { data, error } = await supabase
      .from('looks')
      .insert({
        id: entry.id,
        email,
        photo: entry.photo,
        category: entry.category,
        brand: entry.brand,
        season: entry.season,
        show_name: entry.showName,
        notes: entry.notes,
        tags: entry.tags,
        created_at: entry.createdAt,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Ошибка сохранения:', error);
      throw error;
    }
    
    return {
      id: data.id,
      photo: data.photo,
      category: data.category,
      brand: data.brand || '',
      season: data.season || '',
      showName: data.show_name || '',
      notes: data.notes || '',
      tags: data.tags || [],
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Критическая ошибка сохранения:', err);
    throw err;
  }
}

export async function updateEntry(entry: LookEntry, email: string): Promise<void> {
  const { error } = await supabase
    .from('looks')
    .update({
      photo: entry.photo,
      category: entry.category,
      brand: entry.brand,
      season: entry.season,
      show_name: entry.showName,
      notes: entry.notes,
      tags: entry.tags,
    })
    .eq('id', entry.id);
  
  if (error) throw error;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('looks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
