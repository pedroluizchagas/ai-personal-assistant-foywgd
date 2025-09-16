
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import Icon from '../components/Icon';
import { mockNotes } from '../data/mockData';
import { Note } from '../types';

export default function Notes() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockNotes.map(note => note.category).filter(Boolean)));
  
  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderNote = (note: Note) => (
    <TouchableOpacity key={note.id} style={commonStyles.smallCard}>
      <View style={styles.noteHeader}>
        <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]} numberOfLines={1}>
          {note.title}
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[commonStyles.textSecondary, styles.noteContent]} numberOfLines={3}>
        {note.content.replace(/[#*]/g, '').trim()}
      </Text>
      
      <View style={styles.noteMeta}>
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={commonStyles.textSecondary}>+{note.tags.length - 3}</Text>
          )}
        </View>
        <Text style={commonStyles.textSecondary}>
          {note.updatedAt.toLocaleDateString('pt-BR')}
        </Text>
      </View>
      
      {note.category && (
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {note.category}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Notas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={commonStyles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar notas..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryFilter,
              !selectedCategory && styles.categoryFilterActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryFilterText,
              !selectedCategory && styles.categoryFilterTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryFilter,
                selectedCategory === category && styles.categoryFilterActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryFilterText,
                selectedCategory === category && styles.categoryFilterTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockNotes.length}</Text>
            <Text style={commonStyles.textSecondary}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={commonStyles.textSecondary}>Categorias</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Array.from(new Set(mockNotes.flatMap(note => note.tags))).length}
            </Text>
            <Text style={commonStyles.textSecondary}>Tags</Text>
          </View>
        </View>

        {/* Notes List */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.notesList}>
          {filteredNotes.length > 0 ? (
            <>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                {searchText || selectedCategory 
                  ? `${filteredNotes.length} nota(s) encontrada(s)`
                  : 'Suas Notas'
                }
              </Text>
              {filteredNotes
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .map(renderNote)}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="document-text-outline" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                {searchText || selectedCategory 
                  ? 'Nenhuma nota encontrada'
                  : 'Nenhuma nota criada ainda'
                }
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                {searchText || selectedCategory 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando sua primeira nota'
                }
              </Text>
            </View>
          )}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryFilterActive: {
    backgroundColor: colors.primary,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryFilterTextActive: {
    color: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  notesList: {
    flex: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreButton: {
    padding: 4,
    marginLeft: 8,
  },
  noteContent: {
    lineHeight: 20,
    marginBottom: 12,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
