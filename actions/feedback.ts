"use server";
import { revalidatePath } from 'next/cache';

let feedbacks: string[] = []; // Temporary in-memory storage

export async function submitFeedback(formData: FormData) {
  const feedback = formData.get('feedback') as string;
  feedbacks.push(feedback);
  revalidatePath('/dashboard'); // Revalidate the admin page to show the new feedback
}

export async function getFeedbacks() {
  return feedbacks;
}