<h1 align="center" style="border: none;">🐶 lapisla-prover 🐱</h1>

<p align="center">
    <img align="center" width="800" alt="image" src="https://github.com/user-attachments/assets/37e98c08-2333-463d-9fd3-c8c165a62433" />
</p>

<p align="center" style="text-align: center;"> <strong>lapisla</strong> は battery-pluggable な定理証明支援系です！</p>

<p align="center" style="text-align: center;">  <strong> <a href="https://lapisla.net"> lapisla.net </a>  |  <a href="https://docs.lapisla.net"> docs.lapisla.net </a> </strong>  </p>

<p align="center">
    <a href="README.md">English</a> | <a href="README_ja.md">日本語</a>
</p>

## Concept of lapisla 😸

既存の定理証明支援系は、「一般的な」プログラム開発と比べて難易度が高いと見做されています。

我々は、支持を集めているプログラミング言語には高度に発達したエコシステムが存在し他のユーザの成果を簡単に利用できるのに対して、多くの定理証明支援系にはそのような仕組みがないからだと考えています。

これに対して、 lapisla はブラウザ上で完全に動作するカーネルと UI, そしてレジストリを備えており、容易に成果を共有・利用できる基盤が整っています。

我々はこのような他人の成果を容易に利用できることを 「buttery-pluggable」 と呼んでいます。これこそが lapisla のコンセプトです！

<img width="1280" alt="image" src="https://github.com/user-attachments/assets/18bebe50-9a35-499a-a2c0-263fa8d17ed9" />

<br>

lapisla は、単なる定理証明支援系でなく、レジストリやコミュニティ機能も兼ね備えた「定理証明プラットフォーム」です！

証明を共有する Permanent Link を生成して他の人に送ってみたり、タイムラインで他の人の証明を覗いてみたりしてみましょう！

|                                                                                                                        |                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| <img width="1280" alt="image" src="https://github.com/user-attachments/assets/0a000d27-90ec-4eba-bef6-b5f0950469b1" /> | <img width="1280" alt="image" src="https://github.com/user-attachments/assets/bc1e614a-32e4-41bb-8d64-199a15b0e318" /> |

## How to use lapisla?

lapisla 開発チームによってホストされている [lapisla.net](https://lapisla.net) から lapisla を利用することができます。

lapisla.net は GitHub アカウントによってログインするため、GitHub アカウントが必要です。

### Simple Proof Example

```coq
Theorem and_comm P ∧ Q → Q ∧ P
    apply ImpR
    apply AndR
    apply AndL2
    apply I
    apply AndL1
    apply I
qed
```

### Documentation

lapisla の使い方や機能については [docs.lapisla.net](https://docs.lapisla.net) を参照してください。

## How to contribute to lapisla?

lapisla は貢献を歓迎しています！
lapisla に貢献したい方は、[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## Host your own lapisla 🐕💨

lapisla を自分のサーバでホストすることもできます。

[apps/web](apps/web) にフロントエンド, [apps/backend](apps/backend) にバックエンドのプロジェクトがあります。

ホストするには、それぞれの README を参照してください。

## References

- [lapisla.net](https://lapisla.net)
- [docs.lapisla.net](https://docs.lapisla.net)
- [our blog post (日本語)](trap.jp/post/2478/)

## License

lapisla は [MIT License](LICENSE) の下で公開されています。
