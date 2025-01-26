# lapisla-prover 🐶🐱

<img  style="text-align: center;" width="1311" alt="image" src="https://github.com/user-attachments/assets/18bebe50-9a35-499a-a2c0-263fa8d17ed9" />


lapisla は、みんなのための

- 定理証明支援系
- エコシステム
- プラットフォーム

です！

## モチベーション

既存の定理証明支援系は、「一般的な」プログラム開発と比べて難易度が高いと見做されています。

我々は、支持を集めているプログラミング言語には高度に発達したエコシステムが存在してそれを簡単に利用できるのに対して、多くの定理証明支援系にはそのような仕組みがないからだと考えています。

我々は、ブラウザ上で完全に動作するカーネルと UI, そしてレジストリを作ることによって、容易に成果を共有・利用できる基盤を作り、この問題を解決しようとしています。

## lapisla-kernel

lapisla のカーネルは、シーケント計算を基盤にしており、https://github.com/myuon/claire から強い影響を受けています。

カーネルは [packages/kernel](packages/kernel) 以下にあります。

## lapisla-webui

lapisla は独自に構築された webui で、ローカルと変わらない開発体験を実現します！

webui は [apps/web](apps/web) 以下にあります。

## lapisla-registry

lapisla は ユーザ管理と registry の機能を持ちます。
registry を含むバックエンドは [apps/backend](apps/backend) にあります。

