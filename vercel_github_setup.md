# Vercel と GitHub の連携方法

このドキュメントでは、Vercel にフロントエンドアプリケーションをデプロイするための GitHub Actions のセットアップ方法を説明します。

## 1. Vercel アカウントを作成する

まだ Vercel のアカウントをお持ちでない場合は、[Vercel のサインアップページ](https://vercel.com/signup)でアカウントを作成してください。GitHubアカウントでの登録がおすすめです。

## 2. Vercel CLIをインストールする

ローカル開発環境に Vercel CLI をインストールします：

```bash
npm install -g vercel
```

## 3. Vercel にログインする

```bash
vercel login
```

## 4. プロジェクトをVercelにリンクする

プロジェクトディレクトリで以下のコマンドを実行します：

```bash
cd video-craft-web
vercel link
```

指示に従ってプロジェクトをセットアップしてください。

## 5. Vercelのプロジェクト設定を確認する

以下のコマンドを実行して、必要な設定値を取得します：

```bash
vercel project ls
```

プロジェクト名とIDをメモしておきます。

## 6. Vercel APIトークンを取得する

[Vercelのアカウント設定のトークンページ](https://vercel.com/account/tokens)から新しいトークンを作成します。

「Create」をクリックして、トークンの名前（例：GitHub Actions）を入力し、作成します。
表示されたトークンをコピーしてください（このトークンは一度しか表示されません）。

## 7. Organization IDとProject IDを取得する

以下のコマンドを実行して、Organization IDとProject IDを取得します：

```bash
vercel project ls
```

または、Vercelのダッシュボードからプロジェクト設定を開き、「Project ID」と「Organization ID」を確認します。

## 8. GitHub Secretsの設定

リポジトリのSettings > Secrets and variables > Actionsで、以下のシークレットを追加します：

- `VERCEL_TOKEN`: 先ほどコピーしたVercelのAPIトークン
- `VERCEL_ORG_ID`: VercelのOrganization ID
- `VERCEL_PROJECT_ID`: VercelのProject ID

## 9. 初期デプロイ（オプション）

ワークフローをテストする前に、初回のデプロイを手動で行うこともできます：

```bash
vercel deploy --prod
```

これで、GitHub Actionsを使用してVercelにフロントエンドを自動デプロイするための設定が完了しました。