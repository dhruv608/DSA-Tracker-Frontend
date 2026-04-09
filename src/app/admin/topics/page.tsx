"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import {
   createAdminTopic,
   updateAdminTopic,
   deleteAdminTopic
} from '@/services/admin.service';
import {
   Plus,
   Search,
   Trash2,
   BookOpen,
   AlertTriangle,
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
import { Pagination } from '@/components/Pagination';
import TopicCard from '@/components/admin/topics/components/TopicsCard';
import TopicsPageShimmer from '@/components/admin/topics/shimmers/TopicsPageShimmer';
import TopicsGridShimmer from '@/components/admin/topics/shimmers/TopicsGridShimmer';
import { Topic } from '@/types/admin/topic';
import { useTopics } from '@/hooks/admin/useTopics';
import { handleToastError } from "@/utils/toast-system";

export default function AdminTopicsPage() {
   const { selectedBatch, isLoadingContext } = useAdminStore();
   const router = useRouter();
   const searchParams = useSearchParams();


   // URL Params State
   const [search, setSearch] = useState(searchParams.get('search') || '');
   const [debouncedSearch, setDebouncedSearch] = useState(search);
   const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
   const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');



   // Modals
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

   // Forms
   const [topicName, setTopicName] = useState('');
   const [photoFile, setPhotoFile] = useState<File | null>(null);
   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
   const [removePhoto, setRemovePhoto] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   //Pagination
   const [limit, setLimit] = useState(20);
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
      if (limit !== 20) params.set('limit', limit.toString());
      if (sortBy !== 'recent') params.set('sortBy', sortBy);

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
   }, [debouncedSearch, page, sortBy, router]);


   const {
      topics,
      loading,
      totalRecords,
      refetch,
   } = useTopics({
      batchSlug: selectedBatch?.slug,
      page,
      limit,
      search: debouncedSearch,
      sortBy,
   });

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
         refetch();
      } catch (err: any) {
       handleToastError(err);
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
         if (!selectedTopic) return;

         await updateAdminTopic(selectedTopic.slug, formData);
         setIsEditOpen(false);
         resetForms();
         refetch();
      } catch (err: any) {
       handleToastError(err);
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to update topic');
      } finally {
         setSubmitting(false);
      }
   };

   const handleDeleteSubmit = async () => {
      setFormError('');
      setSubmitting(true);
      try {
         if (!selectedTopic) return;

         await deleteAdminTopic(selectedTopic.slug);
         setIsDeleteOpen(false);
         resetForms();
         refetch();
      } catch (err: any) {
       handleToastError(err);
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

   const openEdit = (topic: Topic) => {
      setSelectedTopic(topic);
      setTopicName(topic.topic_name);
      setPhotoPreview(topic.photo_url ?? null);
      setPhotoFile(null);
      setRemovePhoto(false);
      setFormError('');
      setIsEditOpen(true);
   };



   if (isLoadingContext) {
      return <TopicsPageShimmer />;
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
       <div className="flex flex-col  w-full pb-12   ">

         {/* HEADER */}
         <div className="glass backdrop-blur-2xl rounded-2xl p-6 mb-7 flex items-center justify-between">

            <div className="flex items-center gap-4">
               

               <div>
                  <h2 className="text-3xl font-semibold text-foreground">
                     Topic <span className="text-primary ">Curriculum</span>
                  </h2>
                  <p className='p-0 m-0 mt-1 text-muted-foreground '>this is paragraph</p>
               </div>
            </div>

            {/* RIGHT BADGE */}
            <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
               {totalRecords} Topics
            </div>

         </div>

         {/* FILTER BAR */}
         <div className="glass backdrop-blur-2xl mb-7 rounded-2xl p-4 flex flex-col sm:flex-row gap-4  justify-between items-center">

            {/* SEARCH */}
            <div className="relative w-full sm:max-w-md ">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
               <Input
                  placeholder="Search topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9! w-full h-11! rounded-2xl bg-transparent! placeholder:text-white border! border-border/60! focus-visible:ring-primary/40"
               />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">

               <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 rounded-2xl glass backdrop-blur-2xl border border-border/40 px-6">
                     <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="recent">Recent</SelectItem>
                     <SelectItem value="oldest">Oldest</SelectItem>
                     <SelectItem value="classes">Most Classes</SelectItem>
                     <SelectItem value="questions">Most Questions</SelectItem>
                  </SelectContent>
               </Select>

               <Button
                  onClick={() => { resetForms(); setIsCreateOpen(true); }}
                  className="h-11 px-5 rounded-xl bg-primary text-black font-semibold hover:opacity-90"
               >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Topic
               </Button>

            </div>

         </div>

         {/* GRID */}
         {loading ? (
            <TopicsGridShimmer />
         ) : topics.length === 0 ? (
            <div className="glass  rounded-2xl p-12 text-center flex flex-col items-center">
               <Search className="w-10 h-10 text-muted-foreground/30 mb-4" />
               <h3 className="text-lg font-semibold">No topics found</h3>
               <p className="text-muted-foreground text-sm mt-1">
                  Try changing filters
               </p>
            </div>
         ) : (
            <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {topics.map((topic: Topic) => (
                  <TopicCard
                     key={topic.id}
                     topic={topic}
                     onEdit={openEdit}
                     onDelete={(topic) => {
                        setSelectedTopic(topic);
                        setIsDeleteOpen(true);
                     }}
                  />
               ))}
            </div>
         )}

         <Pagination
            currentPage={page}
            totalItems={totalRecords}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
               setLimit(newLimit);
               setPage(1);
            }}
            showLimitSelector={true}
            loading={loading}
         />

         {/* ================= CREATE MODAL ================= */}
         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="  rounded-2xl p-0 overflow-hidden shadow-xl max-w-[520px]">

               {/* HEADER */}
               <DialogHeader className="px-6 py-5 border-b border-border/40">
                  <DialogTitle className="text-lg font-semibold">
                     Create Topic
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                     Add a new topic to your curriculum
                  </DialogDescription>
               </DialogHeader>

               {/* BODY */}
               <div className="p-6 space-y-6">

                  <form onSubmit={handleCreateSubmit} className="space-y-6">

                     {/* ERROR */}
                     {formError && (
                        <div className="text-sm px-3 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
                           {formError}
                        </div>
                     )}

                     {/* TOPIC NAME */}
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Topic Name <span className="text-destructive">*</span>
                        </label>

                        <Input
                           value={topicName}
                           onChange={(e) => setTopicName(e.target.value)}
                           placeholder="e.g. Arrays and Strings"
                           disabled={submitting}
                           className="h-11 w-full rounded-2xl bg-background/50 border-border focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
                        />
                     </div>

                     {/* FILE INPUT */}
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Cover Image
                        </label>

                        <label className="flex items-center justify-between border border-border rounded-2xl px-4 py-3 cursor-pointer bg-background/40 hover:border-primary/40 hover:bg-background/60 transition-all">

                           <span className="text-sm text-muted-foreground truncate">
                              {photoFile ? photoFile.name : "Choose file"}
                           </span>

                           <span className="px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold">
                              Browse
                           </span>

                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={submitting}
                              className="hidden"
                           />
                        </label>

                        <p className="text-[11px] text-muted-foreground">
                           Max file size: 2MB
                        </p>
                     </div>

                     {/* IMAGE PREVIEW */}
                     {photoPreview && (
                        <div className="border border-border/40 rounded-xl p-3 bg-muted/20 space-y-2">
                           <p className="text-[11px] text-muted-foreground font-medium">
                              Preview
                           </p>

                           <div className="overflow-hidden rounded-lg">
                              <img
                                 src={photoPreview}
                                 alt="Preview"
                                 className="w-full h-36 object-cover transition-transform duration-300 hover:scale-[1.03]"
                              />
                           </div>
                        </div>
                     )}

                     {/* FOOTER */}
                     <DialogFooter className="flex gap-2 pt-2">

                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => setIsCreateOpen(false)}
                           disabled={submitting}
                           className="h-11 px-4"
                        >
                           Cancel
                        </Button>

                        <Button
                           type="submit"
                           disabled={submitting}
                           className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
                        >
                           {submitting ? "Creating..." : "Create Topic"}
                        </Button>

                     </DialogFooter>

                  </form>
               </div>

            </DialogContent>
         </Dialog>

         {/* ================= EDIT MODAL ================= */}
         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="rounded-2xl p-0 overflow-hidden shadow-xl max-w-[520px]">

               {/* HEADER */}
               <DialogHeader className="px-6 py-5 border-b border-border/40">
                  <DialogTitle className="text-lg font-semibold">
                     Edit Topic
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                     Update topic details and image
                  </DialogDescription>
               </DialogHeader>

               {/* BODY */}
               <div className="p-6 space-y-6">

                  <form onSubmit={handleEditSubmit} className="space-y-6">

                     {/* ERROR */}
                     {formError && (
                        <div className="text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                           {formError}
                        </div>
                     )}

                     {/* TOPIC NAME */}
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Topic Name <span className="text-destructive">*</span>
                        </label>

                        <Input
                           value={topicName}
                           onChange={(e) => setTopicName(e.target.value)}
                           disabled={submitting}
                           className="h-11 rounded-2xl w-full  bg-background/40  border-border focus-visible:ring-2 focus-visible:ring-primary/40"
                           placeholder='Arrays'
                        />
                     </div>

                     {/* IMAGE SECTION */}
                     <div className="space-y-3">

                        <label className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                           Cover Image

                           {/* REMOVE TOGGLE */}
                           {photoPreview && (
                              <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                                 <input
                                    type="checkbox"
                                    checked={removePhoto}
                                    onChange={(e) => {
                                       setRemovePhoto(e.target.checked);
                                       if (e.target.checked) {
                                          setPhotoPreview(null);
                                          setPhotoFile(null);
                                       } else {
                                          setPhotoPreview(selectedTopic?.photo_url ?? null);
                                       }
                                    }}
                                    className="accent-primary"
                                    disabled={submitting}
                                 />
                                 <span className="text-muted-foreground">
                                    Remove existing
                                 </span>
                              </label>
                           )}
                        </label>

                        {/* FILE INPUT */}
                        <label className="flex items-center justify-between border border-border rounded-2xl px-4 py-3 cursor-pointer bg-background/40 hover:border-primary/40 transition">

                           <span className="text-sm text-muted-foreground truncate">
                              {photoFile ? photoFile.name : "Choose file"}
                           </span>

                           <span className="px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold">
                              Browse
                           </span>

                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={submitting || removePhoto}
                              className="hidden"
                           />
                        </label>

                        {/* PREVIEW */}
                        {photoPreview && !removePhoto && (
                           <div className="border border-border/40 rounded-xl p-3 bg-muted/20 space-y-2">
                              <p className="text-[11px] text-muted-foreground font-medium">
                                 Preview
                              </p>

                              <div className="overflow-hidden rounded-lg relative">
                                 <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-36 object-cover transition-transform duration-300 hover:scale-[1.03]"
                                 />

                                 <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
                              </div>
                           </div>
                        )}

                     </div>

                     {/* FOOTER */}
                     <DialogFooter className="flex gap-2 pt-2">

                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => setIsEditOpen(false)}
                           disabled={submitting}
                           className="h-11 px-4"
                        >
                           Cancel
                        </Button>

                        <Button
                           type="submit"
                           disabled={submitting}
                           className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
                        >
                           {submitting ? "Saving..." : "Save Changes"}
                        </Button>

                     </DialogFooter>

                  </form>
               </div>

            </DialogContent>
         </Dialog>

         {/* ================= DELETE MODAL ================= */}
         <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="rounded-2xl p-0 overflow-hidden shadow-xl max-w-[480px] z-50">

               {/* HEADER */}
               <DialogHeader className="px-6 py-5 border-b border-red-500/20">
                  <DialogTitle className="text-lg font-semibold text-red-400">
                     Delete Topic
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                     Are you sure you want to delete "{selectedTopic?.topic_name}"? This action cannot be undone.
                  </DialogDescription>
               </DialogHeader>



               {/* BODY */}
               <div className="p-6 space-y-6">

                  {/* WARNING ICON */}
                  <div className="flex flex-col items-center justify-center py-4">
                     <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="w-7 h-7 text-red-500" />
                     </div>
                     <p className="text-sm text-muted-foreground rounded-2xl text-center mt-4 px-6">
                        This action cannot be undone and may affect associated data.
                     </p>
                  </div>

                  {/* TOPIC INFO CARD */}
                  <div className="glass rounded-2xl p-4 flex items-center gap-3 border border-border/40">
                     <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-red-400" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-foreground">
                           {selectedTopic?.topic_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                           {selectedTopic?.classCount} classes attached
                        </p>
                     </div>
                  </div>

                  {/* WARNING BOX */}
                  {(selectedTopic?.classCount ?? 0) > 0 && (
                     <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-2xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-[2px]" />
                        <div className="text-sm text-yellow-400">
                           This topic cannot be deleted because it still has active classes.
                        </div>
                     </div>
                  )}

               </div>

               {/* FOOTER */}
               <DialogFooter className="border-t border-border/40 px-6 py-4 flex gap-3">
                  <Button
                     variant="destructive"
                     onClick={handleDeleteSubmit}
                     disabled={submitting || (selectedTopic?.classCount ?? 0) > 0}
                     className="h-11 w-full mb-4 font-semibold bg-red-500 hover:bg-red-600 text-white"
                  >
                     {submitting ? "Deleting..." : "Delete Topic"}
                  </Button>
               </DialogFooter>

            </DialogContent>
         </Dialog>

      </div>
   );
}

