import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCanvasStore } from '../store/canvasStore';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const CanvasEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCanvas, loading, fetchCanvas } = useCanvasStore();
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (id) {
      fetchCanvas(id);
    }
  }, [id, fetchCanvas]);

  useEffect(() => {
    if (currentCanvas) {
      setTitle(currentCanvas.title);
    }
  }, [currentCanvas]);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading canvas...</p>
        </div>
      </Layout>
    );
  }

  if (!currentCanvas) {
    return (
      <Layout>
        <div className="empty-state">
          <h3>Canvas not found</h3>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Canvas Editor (Coming in Week 3)</h2>
          <div className="dashboard-info">
            <p><strong>Canvas ID:</strong> {currentCanvas._id}</p>
            <p><strong>Title:</strong> {currentCanvas.title}</p>
            <p><strong>Blocks:</strong> {currentCanvas.blocks.length}</p>
            <p><strong>Connections:</strong> {currentCanvas.connections.length}</p>
            <p><strong>Last Edited:</strong> {new Date(currentCanvas.lastEdited).toLocaleString()}</p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CanvasEditorPage;