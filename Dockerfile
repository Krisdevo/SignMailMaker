FROM nginx:alpine

#config nginx

COPY nginx.conf /etc/nginx/nginx.conf

#copie TOUT le contenu de /site dans l'image 
COPY site/ /usr/share/nginx/html/

#vérification de santé (facultatif)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://217.0.0.1/ >/dev/null 2>&1 || exit 1