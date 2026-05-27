export function getApiErrorMessage(error, fallbackMessage) {
  const detail = error?.response?.data?.detail

  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        if (item && typeof item === 'object') {
          const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null
          return field ? `${field}: ${item.msg}` : item.msg
        }

        return ''
      })
      .filter(Boolean)
      .join(', ')
  }

  return fallbackMessage
}
