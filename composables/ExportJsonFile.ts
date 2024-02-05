export function useFileExporter() {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const triggerDownload = (data: Blob, fileName: string) => {
    const blobUrl = window.URL.createObjectURL(data)
    const link = document.createElement('a')

    link.href = blobUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  }

  const exportJSONFile = async (data: any, fileName: string) => {
    loading.value = true
    error.value = null

    try {
      if (!fileName.endsWith('.json'))
        fileName += '.json'

      const blobData = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

      triggerDownload(blobData, fileName)
    }
    catch (err) {
      error.value = err as Error
    }
    finally {
      loading.value = false
    }
  }

  return { loading, exportJSONFile, error }
}
