questions = [
    [
        "1. Apa hukum tajwid dari mim mati bertemu ha dalam kalimat: بُيُوْتِكُمْ حَتّٰى ؟",
        [
            ("A. Idzhar Syafawi", 1.0, 0.0, "Benar. Hukum mim mati bertemu ha adalah Idzhar Syafawi."),
            ("B. Idzhar Haqiqi", 0.4, 0.6, "Salah. Namanya mirip, tapi ini hukum nun mati, bukan mim mati."),
            ("C. Ikhfa Syafawi", 0.6, 0.4, "Mendekati. Ini masih hukum mim mati, tapi bukan huruf ha."),
            ("D. Idzhar Qomariyah", 0.0, 1.0, "Ngaco. Ini jauh sekali karena ini hukum alif lam bertemu huruf qamariyah.")
        ],
        "A"
    ],
    [
        "2. Apa hukum tajwid dari nun mati bertemu ya dalam kalimat: مِنْ يَعْمَلْ ؟",
        [
            ("A. Idgham Bilaghunnah", 0.6, 0.4, "Salah. Ini digunakan untuk lam dan ra."),
            ("B. Idgham Bighunnah", 1.0, 0.0, "Benar. Nun mati bertemu ya termasuk dalam hukum Idgham Bighunnah."),
            ("C. Iqlab", 0.3, 0.8, "Mendekati. Iqlab terjadi saat nun mati bertemu ba."),
            ("D. Izhar Syafawi", 0.0, 1.0, "Ngaco. Ini berlaku untuk mim mati, bukan nun mati.")
        ],
        "B"
    ],
    [
        "3. Apa hukum tajwid dari mim mati bertemu ba dalam kalimat: تَرْمِيهِم بِحِجَارَةٍ ؟",
        [
            ("A. Idgham Mimi", 0.5, 0.5, "Mendekati. Idgham Mimi terjadi bila mim mati bertemu mim."),
            ("B. Iqlab", 1.0, 0.0, "Benar. Mim mati bertemu ba disebut Iqlab."),
            ("C. Ikhfa Haqiqi", 0.3, 0.6, "Salah. Ini berlaku untuk nun mati bertemu huruf-huruf ikhfa."),
            ("D. Idzhar Qomariyah", 0.0, 1.0, "Ngaco Tidak berkaitan, ini hukum alif lam qomariyah.")
        ],
        "B"
    ],
    [
        "4. Apa hukum tajwid dari alif lam bertemu syamsiyah dalam kalimat: وَالشَّمْسِ ؟",
        [
            ("A. Idzhar Qomariyah", 0.3, 0.6, "Salah. Ini berlaku bila alif lam bertemu huruf qomariyah."),
            ("B. Qalqalah", 0.0, 1.0, "Ngaco. Qalqalah adalah pantulan suara pada huruf tertentu."),
            ("C. Idgham Syamsiyah", 1.0, 0.0, "Benar. Huruf syamsiyah seperti 'syin' menjadikan lam tidak dibaca."),
            ("D. Idgham Bighunnah", 0.4, 0.5, "Mendekati. Ini berlaku untuk nun mati/tanwin bertemu ya, nun, mim, wau.")
        ],
        "C"
    ]
]

def calculate_cf(mb, md):
    return mb - md

def main():
    total_cf = 0
    for idx, (question, options, correct) in enumerate(questions):
        print("\n" + question)
        for opt in options:
            print(opt[0])

        answer = input("Jawaban Anda (A/B/C/D): ").strip().upper()
        while answer not in ["A", "B", "C", "D"]:
            answer = input("Masukkan hanya A, B, C, atau D: ").strip().upper()

        selected_index = ord(answer) - ord('A')
        mb, md = options[selected_index][1], options[selected_index][2]
        cf = calculate_cf(mb, md)

        print(f"\n🧠 Evaluasi Soal {idx+1}:")
        for opt in options:
            opt_label = opt[0][0]
            print(f"{opt[0]} → {opt[3]}")

        print(f"\n➡️ Jawaban Anda: {answer} → CF = {cf:.2f}")
        if cf == 1:
            print("✅ Jawaban Anda BENAR!")
        elif cf >= 0:
            print(f"❌ Jawaban hampir benar secara aturan. Jawaban yang benar adalah {correct}.")
        elif cf <= 0:
            print(f"❌ Jawaban Anda salah. Jawaban yang benar adalah {correct}.")
        else:
            print(f"❌ NGAWUR. Jawaban yang benar adalah {correct}.")

        total_cf += cf
        input("\nTekan Enter untuk lanjut ke soal berikutnya...")

    average_cf = total_cf / len(questions)
    print("\n📊 Rangkuman Evaluasi:")
    print(f"CF Rata-rata Anda: {average_cf:.2f}")
    if average_cf >= 0.85:
        print("🟢 Sangat yakin dan akurat.")
    elif average_cf >= 0.6:
        print("🟡 Cukup yakin, bisa ditingkatkan.")
    elif average_cf >= 0.3:
        print("🟠 Perlu penguatan konsep.")
    else:
        print("🔴 Pemahaman masih lemah, perlu belajar lagi.")

if __name__ == "__main__":
    main()
