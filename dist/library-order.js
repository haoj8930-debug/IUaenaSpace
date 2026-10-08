(() => {
  const newest = (a,b) => (b.publishTime || 0) - (a.publishTime || 0) || (a.trackNo || 0) - (b.trackNo || 0) || String(a.title).localeCompare(String(b.title));
  const entryFor = track => {
    const entry = window.IU_MELON_LIKES?.tracks?.[track.id];
    return entry && Number.isSafeInteger(entry.likes) && entry.likes >= 0 && entry.source && entry.asOf ? entry : null;
  };
  window.UAENA_LIBRARY_ORDER = {
    newest, entryFor,
    categories(items) {
      const priority = ['正规专辑','迷你专辑','花书签','单曲'];
      const ranked = items.slice().sort(newest);
      return ranked.sort((a,b) => {
        const left = priority.indexOf(a.category), right = priority.indexOf(b.category);
        return (left < 0 ? priority.length : left) - (right < 0 ? priority.length : right);
      });
    },
    sort(items,order='time-desc') {
      return items.slice().sort((a,b) => {
        if (order === 'melon-likes-desc') {
          const left=entryFor(a),right=entryFor(b);
          if (left && !right) return -1;
          if (!left && right) return 1;
          if (left && right && left.likes !== right.likes) return right.likes-left.likes;
        }
        if (order === 'time-asc') {
          const left=a.publishTime || 0,right=b.publishTime || 0;
          if (left && !right) return -1;
          if (!left && right) return 1;
          if (left !== right) return left-right;
        }
        return newest(a,b);
      });
    }
  };
})();
