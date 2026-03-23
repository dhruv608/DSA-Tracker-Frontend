"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import {
   getAdminBatchTopics,
   createAdminTopic,
   updateAdminTopic,
   deleteAdminTopic
} from '@/services/admin.service';
import {
   Plus,
   Search,
   FolderEdit,
   Trash2,
   Image as ImageIcon,
   BookOpen,
   ArrowRight,
   Layers,
   FileQuestion,
   ChevronLeft,
   ChevronRight,
   MoreVertical,
   Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminTopicsPage() {
   const { selectedBatch, isLoadingContext } = useAdminStore();
   const router = useRouter();
   const searchParams = useSearchParams();

   const [topics, setTopics] = useState<any[]>([]);
   const [loading, setLoading] = useState(false);

   // URL Params State
   const [search, setSearch] = useState(searchParams.get('search') || '');
   const [debouncedSearch, setDebouncedSearch] = useState(search);
   const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
   const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');

   // Pagination State
   const [totalPages, setTotalPages] = useState(1);
   const [totalRecords, setTotalRecords] = useState(0);

   // Modals
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [selectedTopic, setSelectedTopic] = useState<any>(null);

   // Forms
   const [topicName, setTopicName] = useState('');
   const [photoFile, setPhotoFile] = useState<File | null>(null);
   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
   const [removePhoto, setRemovePhoto] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   // Debounce search
   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedSearch(search);
         setPage(1); // Reset to page 1 on search
      }, 500);
      return () => clearTimeout(handler);
   }, [search]);

   // Sync URL
   useEffect(() => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (page > 1) params.set('page', page.toString());
      if (sortBy !== 'recent') params.set('sortBy', sortBy);

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
   }, [debouncedSearch, page, sortBy, router]);

   const fetchTopics = useCallback(async () => {
      if (!selectedBatch) return;
      setLoading(true);
      try {
         const data = await getAdminBatchTopics(selectedBatch.slug, {
            page,
            limit: 12,
            search: debouncedSearch,
            sortBy
         });
         // Handle the new API structure or fallback to array if backend hasn't updated
         if (data && data.topics) {
            setTopics(data.topics);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalRecords(data.pagination?.total || 0);
         } else if (Array.isArray(data)) {
            setTopics(data);
            setTotalPages(1);
            setTotalRecords(data.length);
         }
      } catch (err) {
         console.error("Failed to fetch topics", err);
      } finally {
         setLoading(false);
      }
   }, [selectedBatch, page, debouncedSearch, sortBy]);

   useEffect(() => {
      fetchTopics();
   }, [fetchTopics]);

   // File Validation handler
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFormError('');
      if (!file) {
         setPhotoFile(null);
         setPhotoPreview(null);
         return;
      }

      if (!file.type.startsWith('image/')) {
         setFormError('File must be an image');
         return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
         setFormError('Image size should be less than 2MB');
         return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
         setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
   };

   const handleCreateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);
      try {
         const formData = new FormData();
         formData.append('topic_name', topicName);
         if (photoFile) {
            formData.append('photo', photoFile);
         }

         await createAdminTopic(formData);
         setIsCreateOpen(false);
         resetForms();
         fetchTopics();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to create topic');
      } finally {
         setSubmitting(false);
      }
   };

   const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);
      try {
         const formData = new FormData();
         formData.append('topic_name', topicName);
         if (photoFile) {
            formData.append('photo', photoFile);
         }
         if (removePhoto) {
            formData.append('removePhoto', 'true');
         }

         await updateAdminTopic(selectedTopic.slug, formData);
         setIsEditOpen(false);
         resetForms();
         fetchTopics();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to update topic');
      } finally {
         setSubmitting(false);
      }
   };

   const handleDeleteSubmit = async () => {
      setFormError('');
      setSubmitting(true);
      try {
         await deleteAdminTopic(selectedTopic.slug);
         setIsDeleteOpen(false);
         resetForms();
         fetchTopics();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to delete topic. Ensure it has no classes or questions associated with it.');
      } finally {
         setSubmitting(false);
      }
   };

   const resetForms = () => {
      setTopicName('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setRemovePhoto(false);
      setFormError('');
      setSelectedTopic(null);
   };

   const openEdit = (topic: any) => {
      setSelectedTopic(topic);
      setTopicName(topic.topic_name);
      setPhotoPreview(topic.photo_url);
      setPhotoFile(null);
      setRemovePhoto(false);
      setFormError('');
      setIsEditOpen(true);
   };

   const getPaginationArray = () => {
      const delta = 2; // Pages to show around current
      const range: number[] = [];
      for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
         range.push(i);
      }

      if (page - delta > 2) range.unshift(-1); // -1 signifies '...'
      if (page + delta < totalPages - 1) range.push(-1);

      range.unshift(1);
      if (totalPages > 1) range.push(totalPages);

      return range;
   };

   if (isLoadingContext) {
      return <Skeletons />;
   }

   if (!selectedBatch) {
      return (
         <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card">
            <BookOpen className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
            <p className="text-muted-foreground text-sm max-w-sm">Please select a Global Batch from the top right corner to view specific topic classes.</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col space-y-6">

         <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" /> Topic Curriculum
               </h2>
               <p className="text-muted-foreground mt-1 text-sm">
                  Manage global topics. Showing {totalRecords} total clusters.
               </p>
            </div>
            <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2 shadow-sm">
               <Plus className="w-4 h-4" /> Add Global Topic
            </Button>
         </div>

         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border/60 shadow-sm rounded-xl">
            <div className="relative w-full sm:max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input
                  placeholder="Search topics by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background/50 border-border shadow-none focus-visible:ring-1"
               />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <span className="text-sm text-muted-foreground font-medium whitespace-nowrap hidden sm:inline-block">Sort by:</span>
               <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                  <SelectTrigger className="w-full sm:w-45 bg-background/50">
                     <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="recent">Recently Created</SelectItem>
                     <SelectItem value="oldest">Oldest First</SelectItem>
                     <SelectItem value="classes">Most Classes</SelectItem>
                     <SelectItem value="questions">Most Questions</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Grid Layout */}
         {loading ? (
            <GridSkeletons />
         ) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/60 bg-card/30 rounded-xl">
               <Search className="w-10 h-10 text-muted-foreground/30 mb-4" />
               <h3 className="text-lg font-semibold mb-1">No topics found</h3>
               <p className="text-muted-foreground text-sm max-w-sm">We couldn't find any topics matching your current filter criteria.</p>
               {search && (
                  <Button variant="link" onClick={() => setSearch('')} className="mt-2 text-primary">
                     Clear search filters
                  </Button>
               )}
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {topics.map((topic) => (
                  <Card
                     key={topic.id}
                     onClick={(e) => {
                        // Ensure clicking card routes to topic, except when clicking action buttons
                        const target = e.target as HTMLElement;
                        if (!target.closest('button')) {
                           router.push(`/admin/topics/${topic.slug}`);
                        }
                     }}
                     className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 border-border/40 bg-card rounded-xl flex flex-col h-full cursor-pointer"
                  >
                     {/* Aspect Ratio Cover */}
                     <div className="aspect-video bg-muted/20 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-border/30">
                        {topic.photo_url ? (
                           <img
                              src={topic.photo_url}
                              alt={topic.topic_name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                           />
                        ) : (
                           <ImageIcon className="w-10 h-10 text-muted-foreground/20 transition-transform duration-500 group-hover:scale-110" />
                        )}

                        {/* Floating Action Menu (Edit/Delete) - Subtle rounded icons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-[-5px] group-hover:translate-y-0 duration-200">
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); openEdit(topic); }}
                              className="h-8 w-8 bg-background/90 hover:bg-background border-border/50 text-foreground shadow-sm rounded-full"
                           >
                              <FolderEdit className="w-3.5 h-3.5" />
                           </Button>
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); setSelectedTopic(topic); setIsDeleteOpen(true); }}
                              className="h-8 w-8 bg-background/90 hover:bg-background border-border/50 text-destructive hover:text-destructive shadow-sm rounded-full"
                           >
                              <Trash2 className="w-3.5 h-3.5" />
                           </Button>
                        </div>
                     </div>

                     <CardContent className="flex flex-col flex-1 p-5 justify-between gap-4">
                        <div>
                           {/* Title - max 2 lines truncated */}
                           <h3 className="font-semibold text-base sm:text-[1.125rem] leading-snug text-foreground line-clamp-2">
                              {topic.topic_name}
                           </h3>
                        </div>

                        <div className="flex flex-col gap-4 mt-auto">
                           {/* Inline Minimal Stats */}
                           <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                 <BookOpen className="w-3.5 h-3.5 opacity-70" />
                                 <span>Classes: <span className="text-foreground ml-0.5">{topic.classCount || 0}</span></span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <FileQuestion className="w-3.5 h-3.5 opacity-70" />
                                 <span>Questions: <span className="text-foreground ml-0.5">{topic.questionCount || 0}</span></span>
                              </div>

                           </div>
                           <div className="flex items-center gap-1.5">
                              {/* <Calendar className="w-3.5 h-3.5 opacity-70" /> */}
                              <p>Started At</p>
                              <span className="text-foreground ml-0.5">
                                 {topic.firstClassCreated_at !== null ? new Date(topic.firstClassCreated_at).toLocaleDateString('en-GB').replace(/\//g, '-') : "No Classes Yet"}
                              </span>
                           </div>

                           {/* Minimal CTA */}
                           <Button
                              variant="secondary"
                              className="w-full h-9 bg-muted/50 hover:bg-muted text-sm font-medium gap-1.5 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                              onClick={(e) => { e.stopPropagation(); router.push(`/admin/topics/${topic.slug}`); }}
                           >
                              View Classes <ArrowRight className="w-3.5 h-3.5" />
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}

         {/* Pagination Container */}
         {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center py-6 mt-4">
               <div className="flex items-center gap-1 bg-card border border-border/60 p-1 rounded-xl shadow-sm">
                  {getPaginationArray().map((p, i) => {
                     if (p === -1) {
                        return <div key={`dots-${i}`} className="px-3 py-2 text-muted-foreground">...</div>;
                     }
                     return (
                        <Button
                           key={p}
                           variant={page === p ? "default" : "ghost"}
                           size="icon"
                           className={`h-9 w-9 text-sm font-medium rounded-lg ${page !== p ? 'hover:bg-muted text-muted-foreground' : 'shadow-sm'}`}
                           onClick={() => setPage(p)}
                        >
                           {p}
                        </Button>
                     );
                  })}
               </div>
            </div>
         )}

         {/* CREATE MODAL */}
         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Create Global Topic</DialogTitle>
                  <DialogDescription>Add a new overarching topic layer to the curriculum.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleCreateSubmit} className="space-y-4">
                  {formError && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Topic Name <span className="text-destructive">*</span></label>
                     <Input value={topicName} onChange={e => setTopicName(e.target.value)} required placeholder="e.g. Arrays and Strings" disabled={submitting} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Cover Image <span className="text-muted-foreground text-xs">(Max 2MB)</span></label>
                     <Input type="file" accept="image/*" onChange={handleFileChange} disabled={submitting} className="file:bg-muted file:text-foreground file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-primary/10 cursor-pointer" />
                     {photoPreview && (
                        <div className="mt-4 border border-border rounded-lg p-2 bg-muted/30">
                           <p className="text-xs text-muted-foreground mb-2 font-medium">Live Preview</p>
                           <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-md shadow-sm" />
                        </div>
                     )}
                  </div>
                  <DialogFooter className="pt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} disabled={submitting}>Cancel</Button>
                     <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Topic'}</Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* EDIT MODAL */}
         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Update Topic</DialogTitle>
                  <DialogDescription>Make changes to the global topic details.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleEditSubmit} className="space-y-4">
                  {formError && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Topic Name <span className="text-destructive">*</span></label>
                     <Input value={topicName} onChange={e => setTopicName(e.target.value)} required placeholder="e.g. Arrays and Strings" disabled={submitting} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-sm font-medium flex items-center justify-between">
                        Cover Image
                        {photoPreview && (
                           <label className="flex items-center gap-2 cursor-pointer text-xs font-normal">
                              <input type="checkbox" checked={removePhoto} onChange={(e) => { setRemovePhoto(e.target.checked); if (e.target.checked) { setPhotoPreview(null); setPhotoFile(null); } else { setPhotoPreview(selectedTopic?.photo_url); } }} className="rounded border-input text-primary focus:ring-primary" disabled={submitting || !selectedTopic?.photo_url} />
                              <span className={removePhoto ? 'line-through text-destructive' : 'text-muted-foreground'}>Remove existing image</span>
                           </label>
                        )}
                     </label>
                     <Input type="file" accept="image/*" onChange={handleFileChange} disabled={submitting || removePhoto} className="file:bg-muted file:text-foreground file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-primary/10 cursor-pointer" />
                     {photoPreview && !removePhoto && (
                        <div className="mt-4 border border-border rounded-lg p-2 bg-muted/30">
                           <p className="text-xs text-muted-foreground mb-2 font-medium">Live Preview</p>
                           <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-md shadow-sm" />
                        </div>
                     )}
                  </div>
                  <DialogFooter className="pt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} disabled={submitting}>Cancel</Button>
                     <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* DELETE MODAL */}
         <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-destructive">Delete Topic</DialogTitle>
                  <DialogDescription>This action cannot be undone. You can only delete topics if they have 0 classes assigned across the platform.</DialogDescription>
               </DialogHeader>
               <div className="mt-4 bg-muted/50 border border-border p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                     <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold">{selectedTopic?.topic_name}</p>
                     <p className="text-xs text-muted-foreground">Contains {selectedTopic?.classCount} active classes</p>
                  </div>
               </div>
               {formError && <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
               <DialogFooter className="mt-6 border-t border-border pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>Cancel</Button>
                  <Button type="button" variant="destructive" onClick={handleDeleteSubmit} disabled={submitting || selectedTopic?.classCount > 0}>
                     {submitting ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}

function Skeletons() {
   return (
      <div className="space-y-6 animate-pulse">
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <div className="h-8 w-64 bg-muted rounded-md shrink-0"></div>
               <div className="h-4 w-96 bg-muted/60 rounded-md shrink-0"></div>
            </div>
            <div className="h-10 w-32 bg-muted rounded-md shrink-0"></div>
         </div>
         <div className="h-16 w-full bg-card border border-border rounded-xl"></div>
         <GridSkeletons />
      </div>
   );
}

function GridSkeletons() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
         {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card border border-border/60 rounded-xl overflow-hidden flex flex-col h-[320px]">
               <div className="aspect-video bg-muted w-full shrink-0"></div>
               <div className="p-5 flex flex-col flex-1">
                  <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-muted/50 rounded mb-6"></div>

                  <div className="flex gap-3 mt-auto mb-5">
                     <div className="h-16 w-1/2 bg-muted/40 rounded-lg"></div>
                     <div className="h-16 w-1/2 bg-muted/40 rounded-lg"></div>
                  </div>

                  <div className="h-10 w-full bg-muted rounded shrink-0"></div>
               </div>
            </div>
         ))}
      </div>
   );
}
