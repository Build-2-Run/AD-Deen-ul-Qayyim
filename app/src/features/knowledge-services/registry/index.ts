import { ServiceRegistry } from './ServiceRegistry';
import { BookmarkService } from '../components/BookmarkService';
import { NotesService } from '../components/NotesService';
import { ShareService } from '../components/ShareService';
import { CollectionService } from '../components/CollectionService';
import { CitationService } from '../components/CitationService';

// Initialize the registry with the default services
ServiceRegistry.register({
  id: 'bookmark',
  isAvailable: () => true, // Available for all nodes
  Component: BookmarkService
});

ServiceRegistry.register({
  id: 'notes',
  isAvailable: () => true,
  Component: NotesService
});

ServiceRegistry.register({
  id: 'collections',
  isAvailable: () => true,
  Component: CollectionService
});

ServiceRegistry.register({
  id: 'citation',
  isAvailable: () => true,
  Component: CitationService
});

ServiceRegistry.register({
  id: 'share',
  isAvailable: () => true,
  Component: ShareService
});

export { ServiceRegistry };
