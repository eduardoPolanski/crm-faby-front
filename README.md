# Faby CRM Frontend

Next.js frontend para o worker Baileys + Supabase.

## Variáveis

Copie .env.example para .env.local e preencha:

    NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica

Nunca use a service_role neste projeto.

## Desenvolvimento

    npm install
    npm run dev

## Vercel

Configure o Root Directory do projeto como frontend e adicione as duas variáveis NEXT_PUBLIC_* no ambiente da Vercel.
