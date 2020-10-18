;; Enable installation of packages from MELPA by adding this line before the call to package-initialize.
(load-file "~/.emacs.d/config/melpa_source.el")

;; Added by Package.el.  This must come before configurations of
;; installed packages.  Don't delete this line.  If you don't want it,
;; just comment it out by adding a semicolon to the start of the line.
;; You may delete these explanatory comments.
(package-initialize)

(global-company-mode t)
(global-linum-mode t)
(setq make-backup-files nil)
(setq initial-frame-alist (quote ((fullscreen . maximized))))

(global-set-key (kbd "M-s") (lambda () (interactive) (find-file "~/.emacs.d/init.el")))

;; Optimize garbage collection behavior. 
(load-file "~/.emacs.d/config/gc_config.el")

;; Set font for org-table.
(load-file "~/.emacs.d/config/org_mode_config.el")

;; Add new file extensions support.
(load-file "~/.emacs.d/config/file_extensions_support.el")

;; Some user-defined actions by function.
(load-file "~/.emacs.d/config/user_defined_actions.el")

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 '(custom-enabled-themes (quote (wombat)))
 '(package-selected-packages (quote (markdown-mode json-mode gradle-mode company)))
 '(scroll-bar-mode nil)
 '(tool-bar-mode nil))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:family "宋体" :foundry "outline" :slant normal :weight normal :height 158 :width normal)))))
