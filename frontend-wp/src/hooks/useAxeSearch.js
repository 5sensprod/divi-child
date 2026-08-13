// src/hooks/useAxeSearch.js
// ═══════════════════════════════════════════════════════════════════════════
// LA RECHERCHE DU CATALOGUE AXE, EN UN SEUL ENDROIT
// ═══════════════════════════════════════════════════════════════════════════
// Deux écrans la consomment — la modale du bandeau (`AxeSearch.jsx`) et la
// section « Notre catalogue » de l'accueil (`AxeCatalogSearchSection.jsx`).
// Ils n'ont ni la même mise en page ni le même voisinage, mais exactement le
// même comportement : deux caractères minimum, 300 ms d'attente, retour à la
// page 1 quand la requête change, message d'erreur du serveur affiché tel quel.
//
// Écrit une fois plutôt que deux : c'est ce comportement-là qui a permis de
// trouver le HY093 du serveur sans deviner, et il n'y a aucune raison qu'il
// diverge entre les deux écrans.
//
// Le pendant WooCommerce est `useSearch` / `useProductSearch`, qui portent des
// filtres et un tri que notre recherche n'a pas. Aucun des deux n'appelle
// l'autre.

import { useEffect, useState } from "react";

import { searchProducts } from "../services/axeCatalog";

export const MIN_QUERY = 2;

export function useAxeSearch(perPage = 12) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    loading: false,
    error: null,
    products: [],
    total: 0,
    searched: false,
  });

  // Rester en page 4 d'une recherche qu'on vient de réécrire afficherait un
  // vide qui ressemble à « aucun résultat ».
  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY) {
      setState({
        loading: false,
        error: null,
        products: [],
        total: 0,
        searched: false,
      });
      return undefined;
    }

    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    // Même délai que la recherche WooCommerce (`useSearch.js`) : la frappe ne
    // doit pas produire une requête par caractère sur un mutualisé.
    const timeout = setTimeout(() => {
      searchProducts(trimmed, { page, perPage })
        .then((data) => {
          if (cancelled) return;
          setState({
            loading: false,
            error: null,
            products: data.products || [],
            total: data.total || 0,
            searched: true,
          });
        })
        .catch((error) => {
          if (cancelled) return;
          // Le message du serveur, sans reformulation : c'est lui qui dit ce
          // qui s'est réellement passé.
          setState({
            loading: false,
            error: error.message,
            products: [],
            total: 0,
            searched: true,
          });
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, page, perPage]);

  return {
    query,
    setQuery,
    page,
    setPage,
    perPage,
    totalPages: Math.max(1, Math.ceil(state.total / perPage)),
    ...state,
  };
}
