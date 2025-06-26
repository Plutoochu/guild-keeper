import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Comment, CommentsResponse } from '../types';
import { 
  MessageCircle, 
  Send, 
  Edit, 
  Trash2, 
  User,
  Calendar,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CommentsProps {
  postId: string;
  commentsLocked: boolean;
}

const Comments: React.FC<CommentsProps> = ({ postId, commentsLocked }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get<CommentsResponse>(`/posts/${postId}/comments?page=${page}&limit=10`);
      setComments(response.data.data.comments);
      setPagination({
        currentPage: response.data.data.pagination.currentPage,
        totalPages: response.data.data.pagination.totalPages,
        totalComments: response.data.data.pagination.totalComments
      });
    } catch (err: any) {
      toast.error('Greška pri učitavanju komentara');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setSubmitting(true);
      await axios.post(`/posts/${postId}/comments`, {
        tekst: newComment.trim()
      });
      
      setNewComment('');
      toast.success('Komentar je uspješno dodan');
      fetchComments(); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri dodavanju komentara');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      await axios.put(`/comments/${commentId}`, {
        tekst: editText.trim()
      });
      
      setEditingComment(null);
      setEditText('');
      toast.success('Komentar je uspješno ažuriran');
      fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri ažuriranju komentara');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovaj komentar?')) {
      return;
    }

    try {
      await axios.delete(`/comments/${commentId}`);
      toast.success('Komentar je uspješno obrisan');
      fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Greška pri brisanju komentara');
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditText(comment.tekst);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  const canEditOrDelete = (comment: Comment) => {
    return user && comment.autor._id === user._id;
  };

  const canDelete = (comment: Comment) => {
    return user && (user.tip === 'admin' || comment.autor._id === user._id);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-800">Učitavaju se komentari...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Komentari ({pagination.totalComments})
        </h3>
        {commentsLocked && (
          <div className="flex items-center text-red-600">
            <Lock className="w-4 h-4 mr-1" />
            <span className="text-sm">Zaključano</span>
          </div>
        )}
      </div>

      {}
      {user && !commentsLocked && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              {(user as any)?.slika ? (
                <img
                  src={`http://localhost:5000${(user as any).slika}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Napišite komentar..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">
                  {newComment.length}/1000 karaktera
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Šalje...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Pošalji
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {!user && !commentsLocked && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            <a href="/login" className="text-blue-600 hover:underline">Prijavite se</a> da biste mogli komentirati.
          </p>
        </div>
      )}

      {commentsLocked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-center flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            Komentari su zaključani na ovoj objavi.
          </p>
        </div>
      )}

      {}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Nema komentara. Budite prvi koji će komentirati!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {(comment.autor as any)?.slika ? (
                    <img
                      src={`http://localhost:5000${(comment.autor as any).slika}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">
                        {comment.autor.ime} {comment.autor.prezime}
                      </span>
                      {comment.autor.tip === 'admin' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(comment.createdAt).toLocaleDateString('bs-BA')}
                      </span>
                      <div className="flex items-center space-x-1">
                        {canEditOrDelete(comment) && (
                          <button
                            onClick={() => startEditing(comment)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete(comment) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {editingComment === comment._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        maxLength={1000}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {editText.length}/1000 karaktera
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Otkaži
                          </button>
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            disabled={!editText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded font-medium transition-colors"
                          >
                            Spremi
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.tekst}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchComments(page)}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments; 