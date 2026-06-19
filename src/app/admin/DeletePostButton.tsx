'use client'

import { useRef } from 'react'
import { deletePost } from './actions'

export default function DeletePostButton({
  postId,
  postTitle,
}: {
  postId: string
  postTitle: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        className="btn btn--danger"
        onClick={() => dialogRef.current?.showModal()}
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby={`del-title-${postId}`}
        // Close when the backdrop (the dialog element itself) is clicked.
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
      >
        <div className="modal__body">
          <h3 id={`del-title-${postId}`}>Delete this post?</h3>
          <p>
            &ldquo;{postTitle}&rdquo; will be permanently removed. This
            can&rsquo;t be undone.
          </p>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn--primary"
              onClick={() => dialogRef.current?.close()}
            >
              No, keep it
            </button>
            <form action={deletePost}>
              <input type="hidden" name="id" value={postId} />
              <button type="submit" className="btn btn--danger">
                Yes, delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
