<h1 align="center" style="border: none;">🐶 lapisla-prover 🐱</h1>

<p align="center">
    <img align="center" width="800" alt="image" src="https://github.com/user-attachments/assets/37e98c08-2333-463d-9fd3-c8c165a62433" />
</p>

<p align="center" style="text-align: center;"> <strong>lapisla</strong> is a battery-pluggable theorem proving assistant!</p>

<p align="center" style="text-align: center;">  <strong> <a href="https://lapisla.net"> lapisla.net </a>  |  <a href="https://docs.lapisla.net"> docs.lapisla.net </a> </strong>  </p>

<p align="center">
    <a href="README.md">English</a> | <a href="README_ja.md">日本語</a>
</p>

## Concept of lapisla 😸

Existing theorem proving assistants are often considered more difficult to use compared to "general" software development.

We believe this is because popular programming languages have well-developed ecosystems that allow users to easily leverage others' work, whereas many theorem provers lack such a system.

To address this, **lapisla** provides a fully browser-based kernel and UI, along with a registry, enabling seamless sharing and utilization of proofs.

We call this ability to easily integrate others' work **"battery-pluggable"**, which is the core concept of **lapisla**!

<img width="1280" alt="image" src="https://github.com/user-attachments/assets/18bebe50-9a35-499a-a2c0-263fa8d17ed9" />

<br>

**lapisla is more than just a theorem proving assistant—it's a theorem proving platform!**

You can generate **Permanent Links** to share your proofs with others, or explore the **Timeline** to see what others are proving!

|                                                                                                                        |                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| <img width="1280" alt="image" src="https://github.com/user-attachments/assets/0a000d27-90ec-4eba-bef6-b5f0950469b1" /> | <img width="1280" alt="image" src="https://github.com/user-attachments/assets/bc1e614a-32e4-41bb-8d64-199a15b0e318" /> |

## How to use lapisla?

You can use **lapisla** from [lapisla.net](https://lapisla.net), hosted by the lapisla development team.

Since **lapisla.net** requires GitHub authentication, you will need a GitHub account to log in.

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

For details on how to use lapisla, check out the official documentation at docs.lapisla.net.

## How to contribute to lapisla?

lapisla welcomes contributions!
If you are interested in contributing, please refer to CONTRIBUTING.md.

## Host your own lapisla 🐕💨

You can also host lapisla on your own server.

The frontend is in [apps/web](apps/web),
The backend is in [apps/backend](apps/backend).

For instructions on hosting, refer to the respective README files.

## References

- [lapisla.net](https://lapisla.net)
- [docs.lapisla.net](https://docs.lapisla.net)
- [Our blog post (Japanese)](https://trap.jp/post/2478/)

## License

lapisla is released under the MIT License.
