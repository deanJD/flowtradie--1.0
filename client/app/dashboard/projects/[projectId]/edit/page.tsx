// client/app/dashboard/projects/[projectId]/edit/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_PROJECT_QUERY } from '@/app/lib/graphql/queries/project';
import { GET_PROJECTS_QUERY } from '@/app/lib/graphql/queries/projects'; // <-- We need this for the cache update
import { UPDATE_PROJECT_MUTATION, DELETE_PROJECT_MUTATION } from '@/app/lib/graphql/mutations/project';
import styles from './EditProjectPage.module.css';
import Button from '@/components/Button/Button';
import ConfirmationModal from '@/components/Modal/ConfirmationModal';

export default function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT_QUERY, {
    variables: { projectId },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (projectData && projectData.project) {
      setTitle(projectData.project.title);
      setDescription(projectData.project.description || '');
    }
  }, [projectData]);

  const [updateProject, { loading: updatingProject, error: updateError }] = useMutation(UPDATE_PROJECT_MUTATION, {
    onCompleted: () => {
      router.push(`/dashboard/projects/${projectId}`);
    },
    refetchQueries: [{ query: GET_PROJECT_QUERY, variables: { projectId } }],
  });

  // vvvvvvvvvv THIS IS THE FIX vvvvvvvvvv
  const [deleteProject, { loading: deletingProject, error: deleteError }] = useMutation(DELETE_PROJECT_MUTATION, {
    update(cache, { data: { deleteProject } }) {
      // Read the current projects list from the cache
      const existingData = cache.readQuery<{ projects: any[] }>({ query: GET_PROJECTS_QUERY });

      if (existingData && deleteProject) {
        // Filter out the project that was just deleted
        const updatedProjects = existingData.projects.filter(
          (project) => project.id !== deleteProject.id
        );
        // Write the new, shorter list back to the cache
        cache.writeQuery({
          query: GET_PROJECTS_QUERY,
          data: { projects: updatedProjects },
        });
      }
    },
    onCompleted: () => {
      // On success, go back to the main projects list
      router.push('/dashboard/projects');
    },
  });
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const handleDelete = () => {
    deleteProject({
      variables: {
        deleteProjectId: projectId,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProject({
      variables: {
        updateProjectId: projectId,
        input: {
          title,
          description,
        },
      },
    });
  };

  if (projectLoading) return <p>Loading project for editing...</p>;
  
  return (
    <>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Edit Project</h1>
          
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>Project Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>Description (Optional)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} rows={4} />
          </div>

          {updateError && <p className={styles.errorMessage}>Error: {updateError.message}</p>}

          <div className={styles.buttonGroup}>
            <Button type="submit" disabled={updatingProject}>
              {updatingProject ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button href={`/dashboard/projects/${projectId}`} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>

        <div className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <Button onClick={() => setDeleteModalOpen(true)} variant="secondary" disabled={deletingProject}>
            Delete this Project
          </Button>
          {deleteError && <p className={styles.errorMessage}>Error: {deleteError.message}</p>}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectData?.project?.title}"? This is a soft-delete.`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        confirmText="Delete Project"
        isLoading={deletingProject}
      />
    </>
  );
}