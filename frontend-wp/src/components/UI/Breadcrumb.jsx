// src/components/UI/Breadcrumb.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { BreadcrumbGlassSkeleton } from "./LoadingSkeleton";

const Breadcrumb = ({ items = [], loading = false, className = "" }) => {
  const navigate = useNavigate();

  if (loading) return <BreadcrumbGlassSkeleton className={className} />;

  if (!items || items.length === 0) return null;

  return (
    <nav className={`text-sm ${className}`}>
      <ol className="flex items-center flex-wrap space-x-2 text-white/70">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && <li className="text-white/50">/</li>}
              <li>
                {isLast ? (
                  <span className="text-white font-medium">{item.label}</span>
                ) : (
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
