(defun set-font-for-org-table()
  (interactive)
  (set-face-attribute 'org-table nil :font
		      ;; get font name by "M-x describe-font RET"
		      (format "%s:pixelsize=%d" "Ubuntu Mono-16.0" 21)))

(add-hook 'org-mode-hook 'set-font-for-org-table)
(add-hook 'eww-mode-hook 'set-font-for-org-table)
;; (add-hook 'markdown-mode-hook 'set-font-for-org-table)
(add-hook 'Info-mode-hook 'set-font-for-org-table)
