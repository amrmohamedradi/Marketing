type Locale = "ar" | "en";
type Src = "auto" | "ar" | "en";

const SKIP_BRANDS = new Set([
  "React", "Next.js", "Node.js", "MongoDB", "Figma", "Photoshop", "Illustrator",
  "Vue", "Angular", "TypeScript", "JavaScript", "CSS", "HTML", "PHP", "Python",
  "Java", "Swift", "Kotlin", "Flutter", "Docker", "Kubernetes", "AWS", "Azure",
  "Google Cloud", "Firebase", "Vercel", "Netlify", "GitHub", "GitLab"
]);

function shouldSkip(s: string) {
  const str = String(s).trim();
  return (
    !str ||
    /^\+?\d[\d\s\-()]+$/.test(str) ||        // phone
    /\S+@\S+\.\S+/.test(str) ||              // email
    /^https?:\/\//i.test(str) ||             // URL
    SKIP_BRANDS.has(str)
  );
}

export async function translate(q: string, target: Locale, source: Src = "auto"): Promise<string> {
  if (shouldSkip(q) || target === "en") return q;
  
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q, source, target, format: "text" }),
    });
    
    if (!response.ok) {
      console.warn("Translation failed:", await response.text());
      return q; // Fallback to original text
    }
    
    const data = await response.json();
    return data.translatedText as string;
  } catch (error) {
    console.warn("Translation error:", error);
    return q; // Fallback to original text
  }
}

export async function translateMany(qs: string[], target: Locale, source: Src = "auto"): Promise<string[]> {
  const out: string[] = [];
  const queue: string[] = [];
  const idxs: number[] = [];

  qs.forEach((s, i) => {
    if (shouldSkip(s) || target === "en") { 
      out[i] = s; 
    } else { 
      idxs.push(i); 
      queue.push(s); 
    }
  });

  if (queue.length) {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: queue, source, target, format: "text" }),
      });
      
      if (!response.ok) {
        console.warn("Batch translation failed:", await response.text());
        // Fallback: use original text for failed translations
        idxs.forEach((i, j) => { out[i] = queue[j]; });
      } else {
        const arr = await response.json(); // [{ translatedText }]
        arr.forEach((x: any, j: number) => { 
          out[idxs[j]] = x?.translatedText ?? queue[j]; 
        });
      }
    } catch (error) {
      console.warn("Batch translation error:", error);
      // Fallback: use original text for failed translations
      idxs.forEach((i, j) => { out[i] = queue[j]; });
    }
  }
  
  return out.length ? out : qs;
}