'use client';
import React from 'react';

export function CartSkeleton() {
  return (
    <div className="skeleton-container">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-card-row">
          <div className="skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="skeleton-product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-product-card">
          <div className="skeleton-product-img" />
          <div className="skeleton-product-title" />
          <div className="skeleton-product-price" />
          <div className="skeleton-product-btn" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="skeleton-container" style={{ padding: '24px 16px' }}>
      <div className="skeleton-line long" style={{ height: 24, marginBottom: 16 }} />
      <div className="skeleton-card-row" style={{ height: 120 }}>
        <div className="skeleton-avatar" style={{ width: 80, height: 80 }} />
        <div className="skeleton-lines">
          <div className="skeleton-line long" />
          <div className="skeleton-line medium" />
          <div className="skeleton-line short" />
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton-card-row">
          <div className="skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}
