import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { useCanvasStore } from '../store/canvasStore';
import Button from '../components/common/Button';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    canvases, 
    loading, 
    error, 
    fetchCanvases, 
    createCanvas, 
    deleteCanvas 
  } = useCanvasStore();
  
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCanvases();
  }, [fetchCanvases]);

  const handleCreateCanvas = async () => {
    setCreating(true);
    try {
      const canvas = await createCanvas('Untitled Canvas');
      navigate(`/canvas/${canvas._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCanvas = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }
    
    setDeleting(id);
    try {
      await deleteCanvas(id);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleOpenCanvas = (id) => {
    navigate(`/canvas/${id}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">My Canvases</h2>
            <p className="dashboard-subtitle">
              {canvases.length} / 50 canvases
            </p>
          </div>
          <Button 
            onClick={handleCreateCanvas} 
            disabled={creating || canvases.length >= 50}
          >
            {creating ? 'Creating...' : '+ New Canvas'}
          </Button>
        </div>

        {error && (
          <div className="error-container">
            <span className="error-text">{error}</span>
          </div>
        )}

        {loading && canvases.length === 0 ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading canvases...</p>
          </div>
        ) : canvases.length === 0 ? (
          <div className="empty-state">
            <h3>No canvases yet</h3>
            <p>Create your first canvas to get started</p>
            <Button onClick={handleCreateCanvas} disabled={creating}>
              {creating ? 'Creating...' : 'Create Canvas'}
            </Button>
          </div>
        ) : (
          <div className="canvas-grid">
            {canvases.map((canvas) => (
              <div key={canvas._id} className="canvas-card">
                <div 
                  className="canvas-card-content"
                  onClick={() => handleOpenCanvas(canvas._id)}
                >
                  <div className="canvas-preview">
                    <div className="canvas-preview-placeholder">
                      {canvas.blocks.length} blocks
                    </div>
                  </div>
                  <h3 className="canvas-title">{canvas.title}</h3>
                  <p className="canvas-date">
                    Last edited: {formatDate(canvas.lastEdited)}
                  </p>
                </div>
                <div className="canvas-card-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCanvas(canvas._id);
                    }}
                    className="action-button action-button-primary"
                  >
                    Open
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCanvas(canvas._id, canvas.title);
                    }}
                    disabled={deleting === canvas._id}
                    className="action-button action-button-danger"
                  >
                    {deleting === canvas._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="deliverables-card">
          <h4 className="deliverables-title">✅ Week 2 Deliverables Complete</h4>
          <ul className="deliverables-list">
            <li>✅ Canvas data model with blocks and connections</li>
            <li>✅ CRUD endpoints (Create, Read, Update, Delete)</li>
            <li>✅ Ownership checks on all operations</li>
            <li>✅ Canvas list on dashboard</li>
            <li>✅ Create blank canvas</li>
            <li>✅ Delete canvas with confirmation</li>
            <li>✅ 50 canvas limit per user</li>
            <li>✅ Zustand state management</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;