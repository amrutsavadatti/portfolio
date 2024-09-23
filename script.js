var tl = gsap.timeline();

gsap.from("header", {
    y: -100,
    duration: 1,
})

gsap.from("nav", {
    y: -100,
    duration: 1,
    stagger: 3
})

tl.from(".home-img", {
    x: "-150vw",
    duration: 2,
    scale: 2
})

tl.from(".home-content h1", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

tl.from(".home-content h3", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

tl.from(".home-content p", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

tl.from(".home-content div", {
    opacity: 0,
    y: 30,
    duration: 0.5
})

// gsap.to("#head", {
//     transform: "translateX(-240%)",
//     scrollTrigger: {
//         trigger: "#experience",
//         scroller: "body",
//         markers:true,
//         start: "top -30%",
//         end: "top -100%",
//         scrub: 2,
//         pin:true

//     }
// })

// Working skills slider

// gsap.to("#skills h2", {
//     transform: "translateX(-120%)",
//     scrollTrigger: {
//         trigger: "#skills",
//         scroller: "body",
//         markers:true,
//         start: "top -17%",
//         end: "top -100%",
//         scrub: 1,
//         pin:true

//     }
// })

// gsap.to("#experience #timeline-items", {
//     transform: "translateY(-9000)",
//     scrollTrigger: {
//         trigger: ".experience",
//         scroller: "body",
//         markers: true,
//         start: "top 0%",
//         end: "top -100%",
//         pin: true
//     }
// })