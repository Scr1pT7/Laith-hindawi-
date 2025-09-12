Portfolio v5 — Live Comments + Certificates
- Replaced Testimonials with a **Comments** section (form + live list).
- Added **Certificates** grid with animated badges.
- Still includes: Light/Dark/High-Contrast themes, animations, blog, timeline, contact.
- Comments API is provided for **Node** and **PHP**.

Run Comments API (Node):
1) cd server_node
2) npm init -y && npm i express cors axios nodemailer
3) node server.js
4) Frontend will use /api/comments

Run Comments API (PHP):
- Upload server_php/comments.php to your PHP host.
- In script.js, set USE_PHP_COMMENTS = true.

Customize:
- Add/rename certificates in #certificates grid.
- Moderate comments by editing server storage (comments.json).

Security notes:
- For production, add rate limits and a moderation queue before publishing comments.
