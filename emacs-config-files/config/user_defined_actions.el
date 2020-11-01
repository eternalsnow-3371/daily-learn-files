;; To align codes' comments.
(defun code-align-comment()
  (interactive)
  (align-regexp (point-min-marker) (point-max-marker) "\\(\\s-*\\)//" 1 2 t))
